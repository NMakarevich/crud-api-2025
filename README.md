# CRUD API

## Installation
1. Clone repository 
```bash
git clone https://github.com/NMakarevich/crud-api-2025.git
```
2. Move to develop branch
```bash
git checkout develop
```
3. Install dependencies
```bash
npm install
```

## Run app
1. To change server port number you should open `.env` file and enter port number instead of `4000`. If app doesnt find `.env` or couldn't read `PORT` from this file, app will run on `3000`port.
2. To run app in develop mode enter in terminal
```bash
npm run start:dev 
```
3. To run app in production mode enter in terminal
```bash
npm run start:prod 
```

## Run tests
To run tests enter in terminal 
```bash
npm run test
```