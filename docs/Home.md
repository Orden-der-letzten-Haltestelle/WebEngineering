# 🛒 Webshop
DHBW Projekt for Web Engineering

## 💿 Dependencies

You need to have [Docker](https://www.docker.com/) installed on your system and it should be running during development.

You will also need to have [Node.js](https://nodejs.org/en) installed.

## 💻 Local Development

That you can start the application, you need to be in `/app`

### start dev database

```
./startDevDB.bat
```

When you start the db like that, all data will be lost, when you delete the container.
Every time you execute the `./startDevDB.bat`, the DB will be cleaned and you have a fresh data set based on the data in testdata.sql


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
WEBSHOP_EMAIL_PASSWORD={PASSWORD} (replace with password from onetimesecret)
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
- build the application in docker containers
- start the server

### 🔗 Links

* Access frontend: [http://localhost:3000](http://localhost:3000)
* Access backend: [http://localhost:3000/api](http://localhost:3000/api)

### 📁 Project Structure

```bash
├── app/                        # Node.js server
│   ├── /backend
│   │   ├── /src
│   │   │   ├── /controllers    # All Funktion that define the endpoint and handles errors
│   │   │   ├── /models         # DataAccess (Everything that access the Database)
│   │   │   ├── /objects        # All objects
│   │   │   ├── /routes         # Defining the Endpoints and routing them to the function
│   │   │   └── /services       # Business logic
│   │   └── /tests              # All testcases (discontinued)
│   ├── /frontend               # Static HTML, CSS & JS
│   │   ├── /api                # Functions to fetch backend routes
│   │   ├── /components         # .ejs components for reuse
│   │   ├── /controller         # Eventlisteners and function handeling
│   │   ├── /img                # Images
│   │   ├── /pages              # .ejs pages
│   │   ├── /styles             # .css styles
│   │   ├── frontend.indes.js   # Define Frontend routes
│   │   └── helper.js
│   ├── /config
│   ├── Dockerfile              # Container Configuration of backed
│   ├── index.js                # Index of Backend
│   └── package.json
├── db/
│   ├── init.sql                # Initial DB
│   └── testdata.sql            # Test Data for DB
├── docker-compose.yml          # Container Configuration
├── docker-compose.dev.yml      # Container Configuration for a dev DB
└── start.bat                   # Startup Script
└── startDevDB.bat              # Startup Script for dev DB
```

## 📚 Tech Stack
| Link                                       | Description            |
| ------------------------------------------ | ---------------------- |
| [Node.js](https://nodejs.org/en)           | Runtime Environment    |
| [jest](https://www.npmjs.com/package/jest) | Testing Framwork       |
| [express](https://expressjs.com/)          | Web Framework          |
| [PostgrSQL](https://www.postgresql.org/)   | Database               |
| [Docker](https://www.docker.com/)          | Container & Image Tool |