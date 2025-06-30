# Articles API
This project is a Laravel-based RESTful API for managing a simple Articles system. The API provides endpoints for user registration and authentication, CRUD operations for Articles. 

This README.md provides an overview of the API, database setup, code review, and documentation.
## Table of Contents
  #### 1.	Project Overview
  #### 2.	Installation and Setup
  ####  3.	Database Setup
  #### 4. API Endpoints 
  
# Project Overview
The Articles API includes the following features:

#### •	User Registration and Authentication:
 Secure user registration and JWT-based authentication.

#### •	Articled Management:

 CRUD,Rating and Exploring operations for Articles.

## Installation and Setup
Follow these steps to set up and run the project locally:
#### 1.	Clone the Repository:

## Usage
Copy code

```bash
git clone https://github.com/frzfrsfra3/backend_devteam.git
cd backend_devteam
```
#### 2.	Install Dependencies:

Copy code
```bash
composer install
```
#### 3.	Set Up Environment File:
Copy the example environment file and update the configuration:
```bash
cp .env.example .env
```
Generate the application key:
```bash
php artisan key:generate
```
#### 4.	Set Up JWT Secret:
Generate the JWT secret key:
```bash
php artisan jwt:secret
```
#### 5.	Run Migrations :
```bash
php artisan migrate
```
#### 6.	Start the Laravel Development Server:

```bash
php artisan serve
```

The API will be accessible at http://localhost:8000/api.
## Database Setup
if you want to  create the database tables, use the provided SQL commands:


## API Endpoints
### User Registration and Authentication
#### •	Register User

o	POST /api/register

o	Request Body: 

```
{
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password"
 }
```
o	Response: 200 OK with user details.

#### •	Login

o	POST /api/login
o	Request Body:
``` 
{ 
    "email": "john@example.com", 
    "password": "password" 
}
```

o	Response: 200 OK with JWT token.


#### •	Logout

o	POST /api/logout

o	Headers: Authorization: Bearer {token}

o	Response: 200 OK with success message.


o	Headers: Authorization: Bearer {token}

o	Response: 201 Created with order details.


