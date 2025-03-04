# Introduction 
This is a template project, for a Node v20 API, built with Node.js and Express, to provide user registering and login, authenticating users via JWT.

# Libs used
1.  Express
2.  Axios
3.  TypeORM
4.  BCrypt
5.  Nodemailer

# Build and Run
The following commands are declared on the package.json file:

`dev`: To run the application on your local environment, through `nodemon`;

`build`: To build the application with production configuration;

`start`: To run the application previously built with `node build`;

`docker:build`: To build the Docker image, based on the Dockerfile at the root of the project;

`docker:push`: To send the previously built Docker image to your remote Docker repository;

`docker:run`: To run the previously built Docker image on your local environment;