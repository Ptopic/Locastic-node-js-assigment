# Locastic assigment

### API for blog post creation with user authentication

<br>

<h2>Link for postman api collection from which you can test api <a href="https://www.postman.com/cloudy-star-901232/workspace/locastic-api/collection/19997052-d3b3f5b8-bc64-4c81-8034-9878f3115f75?action=share&creator=19997052">link</a></h2>

or test with swagger ui

<br>

## How to run project

Clone repo

```
git clone https://github.com/Ptopic/Locastic-node-js-assigment.git
```

Cd into backend folder and install dependacies

```
cd backend
npm i
```

<br>

Start dev server

```
npm run start
```

<br>

Route for calling api

```
http://localhost:3001/api/blog/
```

<br>

Swagger ui route

```
http://localhost:3001/api-docs/
```

<br><br>

### .env File structure

JWT_SECRET=
<br>

MYSQL_HOST=
<br>
MYSQL_USER=
<br>
MYSQL_PASSWORD=
<br>
MYSQL_DATABASE=
<br>

Gmail email and password needs to be setup for nodemailer usage it cant be just your regular password because its unsafe

Use this <a href="https://miracleio.me/snippets/use-gmail-with-nodemailer/">link </a> to learn how

GMAIL_EMAIL=
<br>
GMAIL_PASSWORD=
