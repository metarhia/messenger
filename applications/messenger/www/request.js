(client, callback) => {
  if (client.schema === 'http' &&
      !['localhost', '127.0.0.1'].includes(client.host)) {
    client.redirect('https://' + client.host + client.req.url);
  }

  callback();
}
