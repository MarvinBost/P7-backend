# P7-backend

## Project setup

### Configure your database

*in config/config.json*

```json
{
  "development": {
    // username db
    "username": "",
    // password db
    "password": "",
    // name of db for tests (dev)
    "database": "groupomania_dev",
    // adress of database
    "host": "127.0.0.1",
    // dialect of database
    "dialect": "mariadb"

 }
}
```

### Install dependencies

```
npm install
```

### Setup Database

***if you don't use MariaDB***

```
sequelize-cli db:create
```

```
sequelize-cli db:migrate
```

```
sequelize-cli db:seed:all
```

### Launch server

```
node server
```