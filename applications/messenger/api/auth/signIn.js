(login, password, callback) => {
  api.auth.signIn(connection, login, password, (err, user) => {
    if (err) {
      return callback(err);
    }
    callback(null);
  });
}
