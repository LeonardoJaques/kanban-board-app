# Kanban Board App

![welcome-board](https://raw.githubusercontent.com/shellyln/kanban-board-app/master/public/images/icons/icon-96x96.png)

Kanban style task management board app, now powered by **PostgreSQL** and **Node.js 22**.

![welcome-board](https://raw.githubusercontent.com/shellyln/kanban-board-app/master/docs/images/welcome-board.png)

## Features

* Manage tasks with multiple boards
* Manage tasks in team / story lanes
* **Persistent storage with PostgreSQL** (using Prisma ORM)
* **Modern Stack**: Node.js 22, Express backend
* Write kanban in Markdown syntax
* Add QR Code to kanban
* Calendar view
* Dark mode
* PWA support

## Requirements

### Runtime

* **Node.js**: v22 or later
* **Docker**: Required for running the PostgreSQL database locally
* **npm**: v10 or later

### Browsers

* Google Chrome, Firefox, Safari (latest versions)

## Local Development

### 1. Setup the Database

The app uses PostgreSQL. The easiest way to run it is via Docker:

```sh
cd server
docker-compose up -d
```

### 2. Start the Backend Server

The backend is an Express app using Prisma.

```sh
cd server
npm install
npx prisma generate
npx prisma migrate dev
npm start
```

The backend runs on `http://localhost:3001`.

### 3. Start the Frontend

The frontend is a React app.

```sh
npm install
npm start
```

The frontend runs on `http://localhost:3000`.

## Architecture

This project has been modernized to a Client-Server architecture:
- **Frontend**: React + Redux + TypeScript (Migrated to Node 22)
- **Backend**: Node.js + Express
- **Database**: PostgreSQL with Prisma ORM
- **Bridge**: A transparent bridge in `src/lib/db.ts` redirects legacy PouchDB operations to the new PostgreSQL API.

## Settings

### App Settings

Tap or Click `Settings` menu item of drawer and edit YAML text.

| Key                          | Description                                                                                             |
|------------------------------|---------------------------------------------------------------------------------------------------------|
| `display.autoUpdate`         | If true, periodic automatic update of the currently displayed board is enabled.                         |
| `display.autoUpdateInterval` | Periodic automatic update interval in seconds.                                                          |

*Note: Sync settings (`remote.*`) are now managed by the PostgreSQL backend.*

## License

[ISC](https://github.com/shellyln/kanban-board-app/blob/master/LICENSE.md)  
Copyright (c) 2019 Shellyl_N and Authors.
