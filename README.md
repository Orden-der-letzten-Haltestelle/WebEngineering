# Webshop
DHBW Projekt for Web Engineering

## Dependencies

You need to have [Docker](https://www.docker.com/) installed on your system and it should be running during development.

You will also need to have [Node.js](https://nodejs.org/en) installed.

## Local Development

To update the Docker image and containers run:

```bash
./start.bat     #windows
```

This will:
- build the application in docker containers
- start the server

### Links

* Access frontend: [http://localhost:3000](http://localhost:3000)
* Access backend: [http://localhost:3000/api](http://localhost:3000/api)

### To Do
- [x] Docker Compose Structure
- [x] Implementation of DB with PostgreSQL
- [x] `index.html` working
- [ ] Have the DB Data displayed in `index.html`
- [ ] How to do `Auth`?
- [ ] everything else

## Project Structure

```bash
├── app/                    # Node.js server
│   ├── /frontend           # Static HTML, CSS & JS
│   ├── Dockerfile          # Container Configuration of backed
│   ├── index.js              
│   └── package.json        
├── db/                     
│   └── init.sql            # Initial DB
├── docker-compose.yml      # Container Configuration
└── start.bat               # Startup Script
```

## Tech Stack
| Link                                     | Description            |
| ---------------------------------------- | ---------------------- |
| [Node.js](https://nodejs.org/en)         | Runtime Environment    |
| [express](https://expressjs.com/)        | Web Framework          |
| [PostgrSQL](https://www.postgresql.org/) | Database               |
| [Docker](https://www.docker.com/)        | Container & Image Tool |