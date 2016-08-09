(login, password, callback) => {
  api.auth.signIn(connection, login, password, (success) => {
    if (!success) {
      return callback(api.jstp.RemoteError.AUTH_FAILED);
    }
    callback(null);
  });
}
