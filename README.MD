Berties Books – Lab 8

This project continues from the earlier Berties Books labs. In this lab I added user login, password hashing, sanitisation, validation and the changes needed for deployment on the virtual machine.

The app uses Node.js with Express, EJS, MySQL, mysql2, express session, bcrypt, express validator and express sanitizer.

What I did in this lab:

I added password hashing to the registration process using bcrypt. When a user registers, the password is hashed before it goes into the users table.

I added a login system using express session. When a user logs in successfully, their userId is stored in the session. I also made the session available inside all EJS pages.

I added sanitisation using express sanitizer so inputs like first name, last name, email and username are cleaned before being stored. This prevents stored XSS.

I added validation rules with express validator. Email must be valid, username must be between 3 and 20 characters, and passwords must be at least 6 characters. This still allows the test passwords such as smiths and aaaaAAAA1234!.

I also added validation to the add book form so that the price field must be a number and the book name is sanitised.

I added the required test user for marking. Username is gold and password is smiths. This user is included in the insert_test_data.sql file so it is created automatically on the VM.

I set up dotenv so the app uses the following settings:

DB_HOST=localhost
DB_USER=berties_books_app
DB_PASSWORD=qwertyuiop
DB_DATABASE=berties_books

How to run the app locally:

Run npm install
Run node index.js
The app will run on http://localhost:8000

Deployment on the VM:

Clone the repository on the virtual machine.
Run npm install.
Import the SQL file using mysql and the insert_test_data.sql script.
Start the app with the forever command so that it keeps running:

forever start index.js

I also added a links.txt file containing:

home=http://www.doc.gold.ac.uk/usr/348/

This is the link to the running app on the VM.

Routes in the app:

User routes: register, registered, login, loggedin, logout
Book routes: list, addbook, bookadded
Main routes: home and about

The project folder contains index.js, a routes folder, views folder with the ejs files, a public folder for CSS, the SQL script, dotenv file and the links.txt file.

Summary:

This lab added secure password handling, a working login system with sessions, sanitisation, validation and all the VM deployment requirements. All tasks from Part A, Part B and Part C have been completed.
