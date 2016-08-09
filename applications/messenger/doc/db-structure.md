Database Structure
=========================

## Collection 'users'

This collection is intended to store the user accounts. Despite the name and the fact
that it is stored in the security database by default, its schema is different from
that the IAS uses, hence conflicting with it if you want to use Messenger and Impress
accounts simultaneously. If it is the case, the collection should be renamed or stored
in another database, and, preferrably, some solution to synchronize the two authentication
systems should be build on top of it.

There were real reasons not to use the IAS built-in security mechanisms, and `lib/api.auth.js`
provides a generic JSTP authentication solution that will eventually become a part
of JSTP itself after thorough testing in this application for some time before transition
to SRP zero-password-knowledge authentication scheme.

The structure of documents in this collection is as follows:

```javascript
{
  _id: ObjectID('...'),
  login: 'string',
  hash: 'bcrypt-hashed password',
  email: 'user@example.com',
  active: true
}
```

The `login` field should be unique and indexed:

```javascript
db.users.createIndex({ login: 1}, { unique: true });
```
