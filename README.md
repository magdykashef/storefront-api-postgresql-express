# Storefront Backend Project

## Getting Started

To get started, clone this repo and run `npm install` in your terminal at the project root.

### Setup Environment
Bellow are the environmental variables that needs to be set in a `.env` file. This is the default setting that I used for development, but you can change it to what works for you.

First, create a `.env` file with all the required environment variables:
```bash
ENV=dev

POSTGRES_HOST=127.0.0.1
POSTGRES_DB=front_store
POSTGRES_DB_TEST=front_store_test
POSTGRES_USER=reviewer
POSTGRES_PASSWORD=password123

BCRYBT_PASSWORD=speak_friend_and_enter
SALT_ROUNDS=10
TOKEN_SECRET=alohomora123!
```

## Set up Database
### Create Databases
We shall create the dev and test database.
- connect to the default postgres database as the server's root user `psql -U postgres`
- In psql run the following to create a user 
    - `CREATE USER reviewer WITH PASSWORD 'password123';`
- In psql run the following to create the dev and test database
    - `CREATE DATABASE front_store;`
    - `CREATE DATABASE front_store_test;`
- Connect to the databases and grant all privileges
    - Grant for dev database
        - `\c front_store`
        - `GRANT ALL PRIVILEGES ON DATABASE front_store TO reviewer;`
    - Grant for test database
        - `\c front_store_test`
        - `GRANT ALL PRIVILEGES ON DATABASE front_store_test TO reviewer;`
- Exit psql
    - `\q`


## Start App
Run `npm run start`

### Running Ports 
After start up, the server will start on port `3000` and the database on port `5432`

## Endpoint Access
All endpoints are described in the [REQUIREMENT.md](REQUIREMENTS.md) file. 

## Token and Authentication
Tokens are passed along with the http header as 
```
Authorization   Bearer <token>
```

## Testing

### Manual Testing with Postman
    -You need to create a user to acquire the token so you can pass it to other endpoints:
        - Create  'users/' [POST] [body: {firstname: string, lastname: string, password: string}]

### Testing with jasmine
Run test with `npm run test`