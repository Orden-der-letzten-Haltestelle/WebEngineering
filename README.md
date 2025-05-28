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

* Access frontend: [http://localhost:80](http://localhost:80)
* Access backend: [http://localhost:3000/api](http://localhost:3000/api)

### To Do
- [x] Docker Compose Structure
- [x] Implementation of DB with PostgreSQL
- [x] `index.html` working using `nginx`
- [ ] Have the DB Data displayed in `index.html`
- [ ] How to do `Auth`?
- [ ] everything else

## Project Structure

```bash
├── backend/                # Node.js & PostgreSQL
│   ├── Dockerfile          # Container Configuration of backed
│   ├── app.js              
│   └── package.json        
├── frontend/               # Static website
│   ├── css/                
│   ├── views/              
│   └── index.html          
├── db/                     
│   └── init.sql            # Initial DB
├── nginx/                  
│   └── nginx.conf          # Web Server Configuration
├── docker-compose.yml      # Container Configuration
└── start.bat               # Startup Script
```

## Tech Stack
| Link                                     | Description            |
| ---------------------------------------- | ---------------------- |
| [Node.js](https://nodejs.org/en)         | Runtime Environment    |
| [PostgrSQL](https://www.postgresql.org/) | Database               |
| [Docker](https://www.docker.com/)        | Container & Image Tool |
| [nginx](https://nginx.org/)              | HTTP web server        |