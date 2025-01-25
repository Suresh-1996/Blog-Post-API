# Blog post web application

A simple, full-stack web application built with React, Tailwind CSS, Node.js,Express.js and MongoDB. The application allows users to manage User accounts and view blogs.The Admin Users can add new blogs and manage them ,also one admin can create other admin account then they also manage posts.

## api:

- Built with Node.js and Express.js.
- Built all ends-points for front-end and back-end.
- Used JWT token Authenticate users
- Used Web socket.io for realtime blogs updates to front end.
- Used MongoDB databse for store data

## Setup Instructions

#### Prerequisites:

- Node.js installed.
- axios
- web socket.io

#### Steps:

- Clone the Repository

```bash
 git clone <repository-url>
 cd api

```

- Install Dependencies

```bash
  npm install
```

- Start the Development Server

```bash
  node server.js
```

## setup Enviranment variable in .env file

- JWT_SECRET
- MONGO_URL

## setup database Schema

# NOTE: Create first admin manually with hash passowrd in database
- make hashPassowrd.js file and run in node.js
 ```bash
  const bcrypt = require("bcrypt");

(async () => {
  const password = "your password"; // Replace with the desired password
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
  console.log("Hashed Password:", hashedPassword);
})();
```

