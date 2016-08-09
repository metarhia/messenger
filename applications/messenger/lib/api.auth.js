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

api.auth.signUp = (login, password, email, callback) => {
  api.auth.hash(password, (err, hash) => {
    if (err) {
      return callback(err);
    }

    var user = {
      login,
      hash,
      email,
      active: true
    };

    var db = api.auth.config.database;
    db.users.insert(user, (err, result) => {
      if (err) {
        return callback(err);
      }
      var oid = result.ops[0]._id;
      user.id = oid.toString();
      callback(null, user);
    });
  });
};

api.auth.signIn = (connection, login, password, callback) => {
  var db = api.auth.config.database;
  db.users.findOne({ login }, (err, user) => {
    if (err || !user) {
      return callback(false);
    }

    if (!user.active) {
      return callback(false);
    }

    api.auth.verify(password, user.hash, (err, success) => {
      if (err) {
        return callback(false);
      }

      connection.isAuthenticated = true;
      connection.user = user;
      callback(success);
    });
  });
};

api.auth.signOut = (connection, callback) => {
  connection.isAuthenticated = false;
  delete connection.user;
  callback();
};
