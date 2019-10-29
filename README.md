# skynet
A social network that will take over the world.

## Table of Contents 
- [About](#about)
- [Technologies](#technologies)
- [Demo](#demo)
- [Development Setup](#development-setup)
- [Testing](#testing)

## About
This app implements the basic features of a modern social network site. Users can register and login with a valid email address. Once logged in, users can: maintain a profile page (picture, bio), build a network of 'friends' with other users, create public posts, and view/comment on posts of their friends.

## Technologies
- React - version 16.9
- Node - version 10.16.2
- Express - version 4.17.1
- Sequelize - version 5.19.1
- PostgreSQL - version 11.5

## Demo
A live working demo is deployed on Heroku: [Skynet](https://skynet-app-1.herokuapp.com/)

## Development Setup
To clone and build this application, you'll need [Git](https://git-scm.com), [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)), and [PostgreSQL](https://www.postgresql.org/download/) installed on your computer.

### Cloning the Repo:
```bash
$ git clone https://github.com/chrisbrinkmann/skynet.git
```

### Setting Up Your Local Databases:
If Using Windows, add path to the bin folder where psql.exe was installed to Windows Path environemnt variable.

#### Create local 2 local databases named 'skynet' and 'skynet-test'
* If your Postgres username is something other than `postgres`, you will first need to replace `postgres` with your username in the `setup` script in package.json:
  * `psql -U <your_username> -f ./config/dbSetup.sql`
```bash
# Navigate to the repository root
$ cd skynet

# Run script to create the databases
$ npm run setup

# Enter your psql password when prompted
```
* Running this script will drop any existing databases with these names; so be aware that you will lose any previously stored data in your databases by running this script.

#### Postgres GUIs
GUI clients can be used to connect to the database, and provide many useful tools for viewing and manipulating data. Here are a few of the many ones available.

Windows:
- pgAdmin (comes with Postgres)
- [dbeaver](https://dbeaver.io/download/)

Mac:
- [PSequel](http://www.psequel.com)

### Setting Up Local Environment Variables:
/config/.env is a template that has all of the variables needed by the app. It has some initial values already set for convenience.

You will need to setup your own local environment variables. To do this:

- Create a new file named `.env.local` in the config directory.
- Copy the contents of the `.env` file into `.env.local`.
- Add your Postgres username and password to the DATABASE_URL var
- If needed, adjust any other variables for your local environment.

### Starting the Server:
```bash
# Navigate to the repository root
$ cd skynet

# Install dependencies for the server
$ npm run bootstrap

# Start the server
$ npm run server
```
### Starting the Client:
Open a second terminal window
```bash
# Navigate to the client directory
$ cd skynet/client

# Install dependencies for the client
$ npm run bootstrap

# Start the app
$ npm start
```

## Testing

### Testing the Client:
```bash
# Navigate to the client directory
$ cd skynet/client

# Run tests
$ npm test -- --watchAll
```

### Testing the Server:

First you will need to setup environment varibales for testing. To do this:

- Create a new file named `.env.test` in the config directory
- Copy the contents of the `.env` file into `.env.test`
- Add your Postgres username and password to the `DATABASE_URL` var
- Change `skynet` to `skynet-test` in the `DATABASE_URL` var
- If needed, adjust any other variables for your testing environment

#### Test Database Setup

If you have not done so already, follow the steps above for [Setting Up Your Local Databases](#Setting-Up-Your-Local-Databases).

#### Running the tests:

```bash
# Navigate to the root directory
$ cd skynet

# To run all tests
$ npm test

# To run a single test file, add '-t <test_name>'
$ npm test -t users.test.js
```
