# SharePosts
Basic social network

SharePosts is a simple social network app built with Node.js, Angular, MongoDB.

It contains 2 web services running in containers and Nginx as a reverse proxy.

# Dev notes:

After cloning the project you will have 4 directories:
- posts -> web service which exposes post management APIs
- users -> web service which exposes user management APIs
- nginx -> nginx Dockerfile and nginx config file
- SharePosts -> Angular application containing the front-end side

In the "users" directory there is a docker-compose.yml file. In order to build and start the containers

```
docker compose up --build
```

After this step you can start the Angular app by navigating to "SharePosts" directory and

```
npm install
npm start
```

# Documentation

Nginx will send the request to each web service based on url.

Users web service runs on port 3000 and Posts web service runs on port 3001.

Using Nginx, requests like hostname/users will be redirected to hostname:3000 and so on.

## Data model

User model:

```
  {
  "email": string,
  "password": string,
  "name": string
  }
```

Post model:

```
  {
  "userId": reference to User model
  "title": string,
  "description": string,
  "date": Date
  }
```
## REST API

### Create an account

POST http://hostname/users/

```
{   
    "email": string,
    "password": string
    "name": string
}
```

### Login

POST http://hostname/users/login

```
{   
    "email": string,
    "password": string
}
```

Both login and register endpoints will return a JWT token to the client for future requests authorization.

### Add a new post

Headers:
Authorization Bearer <token>

POST http://hostname/posts/
```
{   
    "title": string,
    "description": string
}
```
### Edit a post

Headers:
Authorization Bearer <token>

PUT http://hostname/posts/:id
```
{   
    "title": string,
    "description": string
}
```
### Delete a post

Headers:
Authorization Bearer <token>

DELETE http://hostname/posts/:id

### Get posts

GET http://hostname/posts/

## Functionalities

- Create account (unique email, password and name)
- Login is allowed based on email and password
- Posts are listed chronologically, descending, according to the date of publication and contain title, description, author's name and date of publication
- On home page, each visitor can view all the posts 
- Only logged in users can add a new one or edit/delete their existing posts

## Security

- Passwords must have at least 8 characters containing numbers and letters.
- Passwords are hashed in the database using Bcrypt Node library.
- On the frontend side the application uses interpolated content which is always escaped —the HTML isn't interpreted and the browser displays angle brackets in the element's text content.
- For validating requests the app uses JWT which is created at login/signup on the server-side and it is sent back to the client. 
- The client must attach this JWT token to each request Authorization header.
- By using nginx, applications ports are hidden.
- The frontend app uses a proxy to hide the actual URL by rewriting paths.

