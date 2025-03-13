# NEXU Backend Test

The API is built with Express and TypeScript, running on Firebase Cloud Functions to provide a scalable and efficient API. It handles all the actions listed in the challenge. The architecture was designed with modularity and maintainability in mind, ensuring a seamless integration with the frontend.

## API Endpoints

#### Get All Brands

```http
  GET /brands
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |


#### Get Models of the Brands

```http
  GET /brands/:id/models
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `param` | **Required**. Id of the brand |


#### Create New Brand

```http
  POST /brands
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Required**. Name of the brand to add |

#### Create New Model of a Brand

```http
  POST /brands/:id/models
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `param` | **Required**. Id of the brand |
| `name`      | `string` | **Required**. Name of the Model |
| `average_price`      | `number` | **Optional**. Average Price of the Model |


#### Edit Average Price of Model

```http
  PUT  /models/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `average_price`      | `number` | **Required**. Average price of the Model |


#### Get all Models

```http
  GET /models?greater=380000&lower=400000
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `greater`      | `query` | **Required**. Average price greater than|
| `lower`      | `query` | **Required**. Average price lower than|


## Folders Project Structure

- `/functions`
  - `/src`
    - `/controllers` - _Controllers for handling requests_
    - `/services` - _Business logic_
    - `/routes` - _Express routes_
    - `/models` - _Data models I/O_
    - `/config` - _Firebase and environment config_
    - `/test` - _Tests_
    - `/validators` - _Input request validators_



## Tech Stack

**Server:** Express 4.21.2, Typescript, Firebase Cloud Functions, Firestore.


## Run Locally

Clone the project

```bash
  git clone https://github.com/juanjo097/nexu-backend-test
```

Go to the project directory

```bash
  cd nexu-backend-test
```

Install Fribase Tools

```bash
  npm install -g firebase-tools
```

Login to Firebase to set the environment

```bash
  firebase login
```

Create or using an existing project

```bash
 firebase use --add
```

Install dependencies

```bash
  npm install
```

Build the code

```bash
  npx tsc 
```

Start the server

You can use either of these commands
```bash
  firebase emulators:start 
```
or
```bash
 npm run serve
```

Run the tests

```bash
  npm test
```

To verify that the application is running please go your localhost in this port:

http://localhost:4000/

The application is running and deployed in this route:

https://api-y22dqk2xnq-uc.a.run.app

You will be able to see the emulator overwiew, you can check the Firebase and Functions emulator. If you want to see the database information go to the firebase and the initial data
will be loaded.  

### Notes

I've created a script which will be executed first time the application runs, in this way it will import the database from models.json to a Firestore collections.
