# The scratchpay-test

REST-based API Web Services

## Prerequisites

The following tools need to be installed:

- [Git](http://git-scm.com/)
- [Node.js 14+](http://nodejs.org/)
- [Docker](https://www.docker.com/get-started/)
- [NestJS Framework](https://github.com/nestjs/nest)

## Installation

```bash
git clone <repository-url>
cd <repository-url>
npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test
```

## Test request Apis on Vercel

```bash
# Test has success response
    # Request search by time
    curl -X 'GET' \
      'https://scratchpay-test.vercel.app/api/v1/clinics?from=11%3A00&to=20%3A00' \
      -H 'accept: */*' \
      -H 'x-api-key: 047575c8-68a5-11ed-9022-0242ac120002'
    # Response
      {"status":"success","data":[{"name":"Good Health Home","stateName":"FL","availability":{"from":"15:00","to":"20:00"}}]}


    # Request search by name
    curl -X 'GET' \
      'https://scratchpay-test.vercel.app/api/v1/clinics?name=Mayo%20Clinic' \
      -H 'accept: */*' \
      -H 'x-api-key: 047575c8-68a5-11ed-9022-0242ac120002'
    # Response
    {"status":"success","data":[{"name":"Mayo Clinic","stateName":"Florida","availability":{"from":"09:00","to":"20:00"}}]}


    # Request search by stateName
    curl -X 'GET' \
      'https://scratchpay-test.vercel.app/api/v1/clinics?stateName=FL' \
      -H 'accept: */*' \
      -H 'x-api-key: 047575c8-68a5-11ed-9022-0242ac120002'
    # Response
    {"status":"success","data":[{"name":"Mayo Clinic","stateName":"Florida","availability":{"from":"09:00","to":"20:00"}},{"name":"Hopkins Hospital Baltimore","stateName":"Florida","availability":{"from":"07:00","to":"22:00"}},{"name":"Good Health Home","stateName":"FL","availability":{"from":"15:00","to":"20:00"}}]}


# Test has unauthorized exception
    # Request without api key
    curl -X 'GET' \
      'https://scratchpay-test.vercel.app/api/v1/clinics' \
      -H 'accept: */*' \
      -H 'x-api-key: '
    # Response
      {"status":"error","errors":[{"code":401,"title":"Unauthorized","detail":"The x-api-key not found","correlationId":"46b482f5-7b5e-49a3-8a68-d3c5ca5798d0","timestamp":"2022-11-20T08:34:42.369Z","path":"/api/v1/clinics"}]}
```

## Source structure

```
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── declare
│   └── global.d.ts
├── main.ts
├── modules
│   └── clinic
│       ├── clinic.controller.spec.ts
│       ├── clinic.controller.ts
│       ├── clinic.module.ts
│       ├── handlers
│       │   └── clinic-search.handler.ts
│       ├── repositories
│       │   └── clinic.repository.ts
│       ├── tests
│       │   └── clinic-search.test.ts
│       └── types
│           └── clinic-search.query.ts
├── shared
│   ├── configs
│   │   └── env.config.ts
│   ├── services
│   │   └── apis
│   │       ├── base-api.service.ts
│   │       ├── scratchpay-api.service.ts
│   │       └── types
│   │           └── scratchpay.interface.ts
│   └── shared.module.ts
└── utils
    ├── app-request.ts
    ├── auth
    │   └── auth-verify-api-key.guard.ts
    ├── bootstrap-app.ts
    ├── bootstrap-route-log.ts
    ├── filters
    │   └── http-exception.filter.ts
    ├── interceptors
    │   ├── error-response-transform.interceptor.ts
    │   └── success-response-transform.interceptor.ts
    ├── middlewares
    │   └── logger.middleware.ts
    ├── request-context.ts
    ├── setup-ci-integration.ts
    ├── time-in-range.ts
    ├── to-lower-case.ts
    └── wait-time.ts
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
