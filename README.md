# Project Tracker - API

## About

This is a Role-based Project Management API backed with Authorizations provided by the CASL library, project access is divided into the following categories:

* PROJECT VIEWERS
* PROJECT COLLABORATORS
* PROJECT MANAGERS
* PROJECT ADMINISTRATORS

#### Project Viewers are members of a project and they have the following properties:

* Can only be added to project(s) by project managers of a project
* Have only READ access to projects they are members of

#### Project Collaborators are members of a project, they have the following properties:

* Can only be added to project(s) by project managers of a project
* Have READ access and certain WRITE access on projects they are members of
* Can Open and close issues on a project

#### Project Managers have the following access on projects they create only:

* Automatically becomes proect managers of project(s) they create
* Have Full READ/WRITE access on project(s) they are members of
* Can Add new members and revoke project membership
* Can modify project membership access for other members of a project
* Can update project details such as status, priority, completion date and others

#### Project Administrators

* They have overall administrative rights on all projects, they are more powerful than project managers and have access to some general reports not available to project managers.

## Authors

- [@greazleay](https://www.github.com/greazleay)


## Tech Stack

**Server:** Node

* [TypeScript](https://www.typescriptlang.org/)
* [NestJS](https://nestjs.com/)
* [Fastify](https://fastify.io)
* [PostgreSQL](https://www.postgresql.org/)
* [TypeORM](https://typeorm.io/)
* [Redis](https://redis.io/)
* [Passportjs](https://www.passportjs.org/)
* [Jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
* [CASL](https://casl.js.org/v5/en/)
* [SendGrid Mail](https://www.npmjs.com/package/@sendgrid/mail)
* [@nestjs/swagger](https://www.npmjs.com/package/@nestjs/swagger)
* [Jest](https://jestjs.io/)


## Installation

```bash
  yarn
  # or
  npm install
```

## Running the app

```bash
# development
$ yarn start
  # or
$ npm run start

# watch mode
$ yarn start:dev
  # or
$ npm run start:dev

# production mode
$ yarn start:prod
  # or
$ npm run start:prod
```

## Documentation

Full API Documentation is available [here](https://api-pmt.herokuapp.com/api-docs)


## API Reference

Some of the available routes are listed below:

#### Authentication Routes

##### Auth Login

```http
  POST /auth/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. Your Valid Email |
| `password` | `string` | **Required**. Your Valid Password |

##### Auth Logout

```http
  POST /auth/logout
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `access_token`      | `string` | **Required**. Valid Access Token |

##### Auth Refresh Token

```http
  POST /auth/refresh-token
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `cookies`      | `string` | **Required**. Valid Cookie containing refresh token |


#### User Routes

##### Register

```http
  POST /users/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. Your Valid Email |
| `password` | `string` | **Required**. Password |
| `firstName` | `string` | **Required**. User's first name |
| `lastName` | `string` | **Required**. User's last name |

##### Get User Info

```http
  GET /users/userinfo
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `access_token`      | `string` | **Required**. Valid Access Token |

## License

[MIT](https://choosealicense.com/licenses/mit/)


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://pollaroid.net/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/siezes)


## Badges

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/greazleay/project-tracker-api/blob/main/LICENSE)
[![Language](https://img.shields.io/github/languages/count/greazleay/project-tracker-api)](https://github.com/greazleay/project-tracker-api/)