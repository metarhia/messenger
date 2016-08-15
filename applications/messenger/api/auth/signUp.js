(login, password, name, email, callback) => {
  api.auth.signUp(login, password, name, email, (err, user) => {
    if (err) {
      return callback(new api.jstp.RemoteError(20, 'Registration failed'));
    }
    api.auth.signIn(connection, login, password, (success) => {
      if (!success) {
        return callback(api.jstp.RemoteError.AUTH_FAILED);
      }
      callback(null, user.id);
    });
  });
}
