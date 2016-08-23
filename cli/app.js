'use strict';

global.api = {};
api.jstp = {};
api.url = require('url');
api.events = require('events');
api.readline = require('readline');
api.metasync = require('metasync');

require('impress');

var connection, rl

var commands = {
  signUp: (login, password, name, email, callback) => {
    api.auth.signUp(login, password, name, email, (err, id) => {
      if (err) {
        console.log(err);
      } else {
        console.log('User ID:', id);
      }
      callback();
    });
  },

  signIn: (login, password, callback) => {
    api.auth.signIn(login, password, (err) => {
      if (err) {
        console.log(err);
      }
      callback();
    });
  },

  signOut: (callback) => {
    api.auth.signOut((err) => {
      if (err) {
        console.log(err);
      }
      callback();
    });
  },

  quit: () => {
    rl.close();
    process.exit(0);
  }
};

var address = process.argv[2] || 'jstp://127.0.0.1:3000',
    parsedAddress = api.url.parse(address),
    host = parsedAddress.hostname,
    port = parsedAddress.port,
    secure = parsedAddress.protocol === 'jstps:';

console.log('Waiting for connection...');
connection = api.jstp.connect('messenger', host, port, secure);

connection.application = new api.events.EventEmitter();
connection.application.api = {
};
connection.application.connections = {};
connection.application.sandbox = global;

function fatal(message, error) {
  console.error(message);
  console.error(error);
  process.exit(1);
}

function loadIntrospection(interfaceName, callback) {
  connection.inspect(interfaceName, (err, proxy) => {
    if (err) {
      fatal('Could not read introspection of remote API', err);
    }
    api[interfaceName] = proxy;
    callback(err);
  });
}

connection.on('connect', () => {
  connection.handshake('messenger', 'user', 'pass', (err, sessionHash) => {
    console.log('Connection established, signing in...');

    api.metasync.each(['auth', 'messaging'], loadIntrospection, (err) => {
      if (!err) {
        main();
      }
    });
  });
});

function main() {
  rl = api.readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: (line) => {
      var completions = [
        'rooms', 'users', 'create',
        'join', 'leave', 'post', 'quit'
      ];
      var hints = completions.filter(c => c.startsWith(line));
      return [hints.length ? hints : completions, line];
    }
  });

  prompt();
}

function prompt() {
  setImmediate(() => {
    rl.question('> ', (line) => {
      var input = line.split(' ');
      if (input.length === 0 || input[0] === '') {
        return prompt();
      }

      var command = commands[input[0]];
      if (command) {
        var args = input.slice(1);
        args.push(() => {
          prompt();
        });
        command.apply(commands, args);
      } else {
        console.log('Unknown command, press <Tab> to show completions');
      }
    });
  });
}
