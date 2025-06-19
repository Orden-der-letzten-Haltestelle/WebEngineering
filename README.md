# Webshop

DHBW Projekt for Web Engineering

## Dependencies

You need to have [Docker](https://www.docker.com/) installed on your system and it should be running during development.

You will also need to have [Node.js](https://nodejs.org/en) installed.

## Local Development

That you can start the applikation, you need to be in `/app`

## start dev database
```
./startDevDB.bat
```
When you start the db like that, all data will be lost, when you delete the container.
Everytime you execute the `./startDevDB.bat`, the DB will be cleaned and you have a fresh data set based on the data in testdata.sql


### install
```
cd .\app
npm install
```

### Start dev server

`npm run dev`
The dev server applies all changes directly, you don't need to restart the server when you change a file.

To be able to connect to the database through the applikation, you need to set environment variables in your windows installation:

```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=webshop
WEBSHOP_EMAIL_PASSWORD=(password is in whatsapp chat)
```

### run unittests

```
cd .\app
npm test
```

## Start Docker Containers

To update the Docker image and containers run:

```bash
./start.bat     #windows
```

This will:

-   build the application in docker containers
-   start the server

### Links

-   Access frontend: [http://localhost:3000](http://localhost:3000)
-   Access backend: [http://localhost:3000/api](http://localhost:3000/api)

## Project Structure

```bash
├── app/                        # Node.js server
│   ├── /backend
│   │   ├── /src
│   │   │   ├── /controllers    # All Funktion that define the endpoint and handles errors
│   │   │   ├── /models         # DataAccess (Everything that access the Database)
│   │   │   ├── /objects        # All objects
│   │   │   ├── /routes         # Defining the Endpoints and routing them to the function
│   │   │   └── /services       # Business logic
│   │   └── /tests              # All testcases
│   ├── /config
│   ├── /frontend               # Static HTML, CSS & JS
│   ├── Dockerfile              # Container Configuration of backed
│   ├── index.js
│   └── package.json
├── db/
│   └── init.sql                # Initial DB
├── docker-compose.yml          # Container Configuration
└── start.bat                   # Startup Script
```

## Tech Stack

| Link                                       | Description            |
| ------------------------------------------ | ---------------------- |
| [Node.js](https://nodejs.org/en)           | Runtime Environment    |
| [jest](https://www.npmjs.com/package/jest) | Testing Framwork       |
| [express](https://expressjs.com/)          | Web Framework          |
| [PostgrSQL](https://www.postgresql.org/)   | Database               |
| [Docker](https://www.docker.com/)          | Container & Image Tool |
