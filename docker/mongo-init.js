// MongoDB initialization script
db = db.getSiblingDB('auto-crm');

// Create application user
db.createUser({
  user: 'app_user',
  pwd: 'app_password',
  roles: [
    {
      role: 'readWrite',
      db: 'auto-crm'
    }
  ]
});

// Create initial collections if needed
db.createCollection('users');
db.createCollection('accounts');
db.createCollection('customers');
db.createCollection('employees');
db.createCollection('autoparts');
db.createCollection('tyres');
db.createCollection('shinomontazhs');
db.createCollection('stos');
db.createCollection('washs');
db.createCollection('materials');
db.createCollection('vendors');
db.createCollection('places');
db.createCollection('categorys');

print('MongoDB initialized successfully');
