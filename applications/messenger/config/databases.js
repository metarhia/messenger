{
  // Databases including persistent session storage and application specific

  messenger: {
    alias: 'messengerDb', // optional alias to access database from global context
    url: 'mongodb://127.0.0.1:27017/messenger', // connection string
    // collections: ['sessions', 'users', 'groups', 'testCollection'], // optional
    slowTime: '2s', // timeout to mark requests as "slow"
    security: true
  }

}
