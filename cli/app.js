'use strict';

// Create an Impress-like environment

global.api = {};

api.jstp = {};
api.url = require('url');
api.events = require('events');
api.readline = require('readline');
api.metasync = require('metasync');

require('impress');

// Readline interface
const rl = api.readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer(line) {
    const completions = [
      'rooms', 'users', 'create',
      'join', 'leave', 'post', 'quit'
    ];
    const hints = completions.filter(c => c.startsWith(line));
    return [hints.length ? hints : completions, line];
  }
});

// CLI commands handlers
const commands = {
  signUp(login, password, name, email, callback) {
    api.auth.signUp(login, password, name, email, (err, id) => {
      if (err) {
        console.log(err);
      } else {
        console.log('User ID:', id);
      }
      callback();
    });
  },

  signIn(login, password, callback) {
    api.auth.signIn(login, password, (err) => {
      if (err) {
        console.log(err);
      }
      callback();
    });
  },

  signOut(callback) {
    api.auth.signOut((err) => {
      if (err) {
        console.log(err);
      }
      callback();
    });
  },

  quit() {
    rl.close();
    process.exit(0);
  }
};

// Fail with an error message
//   message - detailed custom error message
//   error - exception instance
//
function fatal(message, error) {
  console.error(message);
  console.error(error);
  process.exit(1);
}

// Load introspection of a remote interface
//   connection - JSTP connection
//   interfaceName - name of the interface
//   callback - callback function
//
function loadIntrospection(connection, interfaceName, callback) {
  connection.inspect(interfaceName, (err, proxy) => {
    if (err) {
      fatal('Could not read introspection of remote API', err);
    }
    api[interfaceName] = proxy;
    callback(err);
  });
}

// Setup JSTP connection with the server
//   callback - callback function
//
function setupConnection(callback) {
  const address = process.argv[2] || 'jstp://127.0.0.1:3000';
  const parsedAddress = api.url.parse(address);
  const host = parsedAddress.hostname;
  const port = parsedAddress.port;
  const secure = parsedAddress.protocol === 'jstps:';

  console.log('Waiting for connection...');
  const connection = api.jstp.connect('messenger', host, port, secure);

  connection.application = new api.events.EventEmitter();
  connection.application.api = {};
  connection.application.connections = {};
  connection.application.sandbox = global;

  connection.on('connect', () => {
    connection.handshake('messenger', 'user', 'pass', (err, sessionHash) => {
      api.metasync.each(['auth', 'messaging'],
        loadIntrospection.bind(null, connection),
        (err) => {
          if (err) throw err;
          callback();
        });
    });
  });
}

// Custom readline prompt function that doesn't block us from using
// rl.question inside handlers
//
function prompt() {
  setImmediate(() => {
    rl.question('> ', (line) => {
      let input = line.split(' ').filter(fragment => fragment !== '');
      if (input.length === 0 || input[0] === '') {
        return prompt();
      }

      let command = commands[input[0]];
      if (command) {
        let args = [...input.slice(1), prompt];
        command.apply(commands, args);
      } else {
        console.log('Unknown command, press <Tab> to show completions');
      }
    });
  });
}

setupConnection(prompt);
