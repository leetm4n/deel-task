# DEEL BACKEND TASK

This is a fastify / sequelize server that implements the Deel backend task using TypeScript.

## 🚀 Additions, refactor of codebase

### Fastify instead of Express
Express is an outdated web framework with a lot of performance issues and no first class TypeScript support. Fastify encapsulates all the paradigms of Express and builds on top of it with added functionality like out of the box schema validation, TypeScript support.

### TypeScript support
The repository was upgraded to use TypeScript

### NPM security vulnerabilities
NPM packages were upgraded to latest stable releases of packages

### Strict Linting
ESLint was introduced with strict linting rules

### API Tests
Introduced API integration tests run by jest to validate functional requirements

### GitHub Actions
Simple pipeline running lint, audit and tests

### Data Models
All models are defined under src/entities/model.ts

Seeding can be done via `npm run seed`

## *Considered improvements*
Due to time limit, these could not be reached, but would be nice to have in the future:
- simple frontend to interact with backend
- using PostgreSQL instead of SQLite
- generating OpenAPI documentation with [fastify-swagger](https://github.com/fastify/fastify-swagger)
- introduce proper DI, remove decoration of request object
- introduce proper authentication, authorization logic
- more edge case testing, unit testing of critical functionality
