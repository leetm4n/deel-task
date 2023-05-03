# DEEL BACKEND TASK

This is a fastify / sequelize server that implements the Deel backend task using TypeScript.

## 🚀 *Additions, refactor of codebase*

### Fastify instead of Express
Express is an outdated web framework with a lot of performance issues and no first class TypeScript support. Fastify encapsulates all the paradigms of Express and builds on top of it with added functionality like out of the box schema validation, TypeScript support.

### TypeScript support
The repository was upgraded to use TypeScript

### NPM security vulnerabilities
NPM packages were upgraded to latest stable releases of packages

### Strict Linting
ESLint was introduced with strict linting rules

### API Tests
ESLint was introduced with strict linting rules

## Data Models

All models are defined in src/entities/model.ts

Seeding can be done via `npm run seed`

### Profile

A profile can be either a `client` or a `contractor`.
clients create contracts with contractors. contractor does jobs for clients and get paid.
Each profile has a balance property.

### Contract

A contract between and client and a contractor.
Contracts have 3 statuses, `new`, `in_progress`, `terminated`. contracts are considered active only when in status `in_progress`
Contracts group jobs within them.

### Job

contractor get paid for jobs by clients under a certain contract.

## Getting Set Up

1. Start by cloning this repository.

2. In the repo root directory, run `npm install` to gather all dependencies.

3. Next, `npm run seed` will seed the local SQLite database. **Warning: This will drop the database if it exists**. The database lives in a local file `database.sqlite3`.

4. Then run `npm start` which should start the server.

## Technical Notes

- The server is running with [ts-node-dev](https://github.com/wclr/ts-node-dev) which will automatically restart for you when you modify and save a file.

- The database provider is SQLite, which will store data in a file local to your repository called `database.sqlite3`. The ORM [Sequelize](http://docs.sequelizejs.com/) is on top of it. You should only have to interact with Sequelize - **please spend some time reading sequelize documentation before starting the exercise.**

- To authenticate users use the `getProfileMW` middleware that is located under `src/controllers/middleware/get-profile.ts`. users are authenticated by passing `profile_id` in the request header. After a user is authenticated their profile will be available under `req.user`. make sure only users that are on the contract can access their contracts.

- The server is running on port `1337` by default, can be changed via env variable `PORT`.

## API functional requirements

1. **_GET_** `/contracts/:id` - It should return the contract only if it belongs to the profile calling.

1. **_GET_** `/contracts` - Returns a list of contracts belonging to a user (client or contractor), the list should only contain non terminated contracts.

1. **_GET_** `/jobs/unpaid` - Get all unpaid jobs for a user (**_either_** a client or contractor), for **_active contracts only_**.

1. **_POST_** `/jobs/:job_id/pay` - Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.

1. **_POST_** `/balances/deposit/:userId` - Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)

1. **_GET_** `/admin/best-profession?start=<date>&end=<date>` - Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.

1. **_GET_** `/admin/best-clients?start=<date>&end=<date>&limit=<integer>` - returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2.

```json
 [
    {
        "id": 1,
        "fullName": "Reece Moyer",
        "paid" : 100.3
    },
    {
        "id": 200,
        "fullName": "Debora Martin",
        "paid" : 99
    },
    {
        "id": 22,
        "fullName": "Debora Martin",
        "paid" : 21
    }
]
```
