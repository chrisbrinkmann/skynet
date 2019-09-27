# skynet
A social network that will take over the world.

## Table of Contents 
- [About](#about)
- [Technologies](#technologies)
- [Demo](#demo)
- [Development Setup](#development-setup)
- [Testing](#testing)

## About
This app will implement the basic features of a modern social network site. Users can register and login with a valid email address. Once logged in, users can: maintain a profile page (picture, bio), build a network of 'friends' with other users, create public posts, and view/comment on posts of their friends.

## Technologies
- React - version 16.9
- Node - version 10.16.2
- Express - version 4.17.1
- PostgreSQL - version 11.5

## Demo
A live working demo will be deployed to Heroku.

## Development Setup
To clone and build this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

### Cloning the repo:
```bash
$ git clone https://github.com/chrisbrinkmann/skynet.git
```

### Starting the server:
```bash
# Navigate to the repository root
$ cd skynet

# Install dependencies for the server
$ npm i

# Start the server
$ npm start
```
### Starting the client:
Open a second terminal window
```bash
# Navigate to the client directory
$ cd skynet/client

# Install dependencies for the client
$ npm i

# Start the app
$ npm start
```

### Setting Up A Local DB

#### Download & Install PostgreSQL v11.5 https://www.postgresql.org/download/

#### Following the installation wizard:
- Use default port: 5432
- Use default superuser: postgres
- Be sure to save your password, you will need it to connect to the DB.

#### If using Windows:
Add path to bin folder where psql.exe was installed to Windows Path environemnt variable.


#### Create a new DB named "skynet" with owner/user "postgres":
```bash
$ createdb -O <user> -U <user> <db_name>
```

#### Connect to local Postgres server with user "postgres" (starts psql shell):
```bash
$ psql -U <user>
```

#### Connect to the "skynet" DB from the psql shell:
```psql
postgres=# \c <db_name>
```

Once connected to the skynet DB, you can run SQL commands on it. Run the following SQL commands to generate the tables used by this app:

```SQL
/** Drop any existing tables */

DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS relations;
DROP TABLE IF EXISTS users;

/** Create tables */

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT,
  bio TEXT,
  password TEXT NOT NULL,
  joined DATE DEFAULT CURRENT_DATE
);

CREATE TABLE relations (
  first_user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  second_user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  relation TEXT DEFAULT 'none',
  CONSTRAINT valid_relation CHECK (relation = 'none' OR relation ='pending_first_second' OR relation = 'pending_second_first' OR relation = 'friends'),
  PRIMARY KEY (first_user_id, second_user_id)
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
  contents TEXT NOT NULL,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  parent_post_id INTEGER REFERENCES posts (id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Postgres GUIs
Connecting to the DB, and running SQL commands can be done thru the command line as described above, or thru a GUI client. GUI clients may be more convenient for running scripts, and provide additional tools for viewing and manipulating data. There are many options for GUI clients.

Windows:
- pgAdmin (comes with Postgres)
- [dbeaver](https://dbeaver.io/download/)

Mac:
- PSequel 


## Testing

