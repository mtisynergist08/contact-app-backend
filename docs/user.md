<!-- @format -->

# User API Spec

## Register User API

Endpoint: POST /api/users

Request Body :

```json
{
  "username": "mizi",
  "password": "rahsia",
  "name": "mti-synergist"
}
```

Response Body Success:

```json
{
  "data": {
    "username": "mizi",
    "name": "mti-synergist"
  }
}
```

Response Body Error:

```json
{
  "errors": "Username already existed"
}
```

## Login User API

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username": "mizi",
  "password": "rahsia"
}
```

Response Body Success:

```json
{
  "data": {
    "token": "unique-token"
  }
}
```

Response Body Errors:

```json
{
  "errors": "Username or password invalid"
}
```

## Update User API

Endpoint : PATCH /api/users/current

Headers :

- Authorization: token

Request Body:

```json
{
  "name": "mti-synergist", // optional
  "password": "new password" // optional
}
```

Response Body Success:

```json
{
  "data": {
    "username": "mizi",
    "name": "mti-synergist"
  }
}
```

Response Body Error :

```json
{
  "errors": "Name length max 100"
}
```

## Get User API

Endpoint : GET /api/users/current

Headers:
- Authorization: token:

Response Body Success:

```json

{
  "data": {
    "username": "mizi",
    "name": "mti-synergist"
  }
}

```

Response Body Error:

```json
{
  "errors":"unauthorized"
}
```

## Logout User API

Endpoint : DELETE /api/users/logout

Headers:
- Authorization: token:

Response Body Success:

```json
{
  "data" : "OK"
}
```

Response Body Error:

```json
{
  "errors" : "unauthorized"
}
```