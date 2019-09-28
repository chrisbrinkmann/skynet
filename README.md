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
- Sequelize - version 5.19.1
- PostgreSQL - version 11.5

## Demo
A live working demo will be deployed to Heroku.

## Development Setup
To clone and build this application, you'll need [Git](https://git-scm.com), [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)), and [PostgreSQL](https://www.postgresql.org/download/) installed on your computer.

### Cloning the Repo:
```bash
$ git clone https://github.com/chrisbrinkmann/skynet.git
```

### Setting Up A Local DB:
If Using Windows, add path to the bin folder where psql.exe was installed to Windows Path environemnt variable.

#### Create a local DB named 'skynet'
```bash
# Navigate to the repository root
$ cd skynet

# Run script to create the DB
$ npm run createdb

# If your Postgres username is something other than 'postgres', you will first need to replace 'postgres' with your username in the 'createdb' script in package.json (createdb -O <username> -U <username> skynet)
```

#### Postgres GUIs
GUI clients can be used to connect to the database, and provide many useful tools for viewing and manipulating data. Here are a few of the many ones available.

Windows:
- pgAdmin (comes with Postgres)
- [dbeaver](https://dbeaver.io/download/)

Mac:
- [PSequel](http://www.psequel.com)

### Setting Up Environment Variables:
/config/.env is a template that has all of the variables needed by the app. It has some initial values already set for convenience.

You will need to setup your own local environment variables. To do this:

- Create a new file named '.env.local' in the config directory.
- Copy the contents of the '.env' file into '.env.local'.
- Add your Postgres username and password
- If needed, adjust any other variables for your local environment.

### Starting the Server:
```bash
# Navigate to the repository root
$ cd skynet

# Install dependencies for the server
$ npm i

# Start the server
$ npm run server
```
### Starting the Client:
Open a second terminal window
```bash
# Navigate to the client directory
$ cd skynet/client

# Install dependencies for the client
$ npm i

# Start the app
$ npm start
```

## Testing