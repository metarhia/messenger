(login, password, name, email, callback) => {
  api.auth.signUp(login, password, name, email, (err, user) => {
    if (err) {
      return callback(new api.jstp.RemoteError(20, 'Registration failed'));
    }
    api.auth.signIn(connection, login, password, (err) => {
      if (err) {
        return callback(err);
      }
      callback(null, user.id);
    });
  });
}
