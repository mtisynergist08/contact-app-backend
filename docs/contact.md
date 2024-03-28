<!-- @format -->

# Contact API Spec

## Create Contact API

Endpoint: POST /api/contacts

Headers :

- Authorization: token

Request Body:

```json
{
  "first_name": "Mohammad",
  "last_name": "Ismail",
  "email": "mohammadtarmizi@gmail.com",
  "phone": "60187770644"
}
```

Response Body Success:

```json
{
  "data": {
    "id": 1,
    "first_name": "Mohammad",
    "last_name": "Ismail",
    "email": "mohammadtarmizi@gmail.com",
    "phone": "60187770644"
  }
}
```

Response Body Error:

```json
{
  "errors": "Email format is invalid"
}
```

## Update Contact API

Endpoint: PUT /api/contacts/:id

Headers :

- Authorization: token

Request Body:

```json
{
  "id": 1,
  "first_name": "Mohammad",
  "last_name": "Ismail",
  "email": "mohammadtarmizi@gmail.com",
  "phone": "60187770644"
}
```

Response Body Success:

```json
{
  "data": {
    "id": 1,
    "first_name": "Mohammad",
    "last_name": "Ismail",
    "email": "mohammadtarmizi@gmail.com",
    "phone": "60187770644"
  }
}
```

Response Body Error:

```json
{
  "errors": "Email format is invalid"
}
```

## Get Contact API

Endpoint: GET /api/contacts/:id

Headers :

- Authorization: token

Response Body Success:

```json
{
  "data": {
    "id": 1,
    "first_name": "Mohammad",
    "last_name": "Ismail",
    "email": "mohammadtarmizi@gmail.com",
    "phone": "60187770644"
  }
}
```

Response Body Error:

```json
{
  "errors": "Contact not found"
}
```

## Search Contact API

Endpoint: GET /api/contacts

Headers :

- Authorization: token

Query params:

- name: Search by first_name or last_name, using like, optional
- email: Search by email, using like, optional
- phone: Search by phone using like, optional
- page: number of pages, default 1
- size: size per page, default 10

Response Body Success:

```json
{
  "data": [
    {
      "id": 1,
      "first_name": "Mohammad",
      "last_name": "Ismail",
      "email": "mohammadtarmizi@gmail.com",
      "phone": "60187770644"
    },
    {
      "id": 2,
      "first_name": "Mohammad",
      "last_name": "Ismail",
      "email": "mohammadtarmizi@gmail.com",
      "phone": "60187770644"
    }
  ],
  "pagination": {
    "page": 1,
    "total_page": 3,
    "total_data": 30
  }
}
```

Response Body Error:

```json
{
  "errors": "Contact not found"
}
```

## Delete Contact API

Endpoint: DELETE /api/contacts/:id

Headers :

- Authorization: token

Response Body Success:

```json
{
  "data": "OK"
}
```

Response Body Error:

```json
{
  "errors": "Contact not found"
}
```
