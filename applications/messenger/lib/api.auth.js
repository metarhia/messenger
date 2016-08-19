api.auth = {};

api.auth.config = {
  saltRounds: 10,
  database: application.databases.security
};

api.auth.hash = (password, callback) => {
  api.bcrypt.genSalt(api.auth.config.saltRounds, (err, salt) => {
    if (err) {
      return callback(err);
    }

    api.bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        return callback(err);
      }

      callback(null, hash);
    });
  });
};

api.auth.verify = (password, hashed, callback) => {
  api.bcrypt.compare(password, hashed, callback);
};

api.auth.signUp = (login, password, name, email, callback) => {
  api.auth.hash(password, (err, hash) => {
    if (err) {
      return callback(err);
    }

    let user = {
      login,
      hash,
      name,
      email,
      active: true
    };

    let db = api.auth.config.database;
    db.users.insert(user, (err, result) => {
      if (err) {
        return callback(err);
      }

      let oid = result.ops[0]._id;
      user.id = oid.toString();

      application.emit('newUser', user);
      callback(null, user);
    });
  });
};

api.auth.signIn = (connection, login, password, callback) => {
  if (connection.isAuthenticated) {
    return callback(new Error('user is already authenticated'));
  }

  let db = api.auth.config.database;
  db.users.findOne({ login }, (err, user) => {
    if (err || !user) {
      return callback(new Error('user not found'));
    }

    if (!user.active) {
      return callback(new Error('user is not active'));
    }

    api.auth.verify(password, user.hash, (err, success) => {
      if (err || !success) {
        return callback('incorrect password');
      }

      connection.isAuthenticated = true;
      connection.user = user;
      callback(null, user);
    });
  });
};

api.auth.signOut = (connection, callback) => {
  connection.isAuthenticated = false;
  delete connection.user;
  callback();
};
