<!-- @format -->

# Address API Spec

## Create Address API

Endpoint : POST /api/contacts/{contact_id}/addresses

Headers :

- Authorization: token

Request Body:

```json
{
  "street": "Jln Taman Puteri Jaya 2",
  "city": "Sungai Petani",
  "province": "Kedah",
  "country": "Malaysia",
  "zip_code": "08000"
}
```

Response Body Success:

```json
{
  "data": {
    "id": 1,
    "street": "Jln Taman Puteri Jaya 2",
    "city": "Sungai Petani",
    "province": "Kedah",
    "country": "Malaysia",
    "zip_code": "08000"
  }
}
```

Response Body Error:

```json
{
  "errors": "Country required"
}
```

## Update Address API

Endpoint : PUT /api/contacts/{contact_id}/addresses/:address_id

Headers :

- Authorization: token

Request Body:

```json
{
  "street": "Jln Taman Puteri Jaya 2",
  "city": "Sungai Petani",
  "province": "Kedah",
  "country": "Malaysia",
  "zip_code": "08000"
}
```

Response Body Success:

```json
{
  "data": {
    "id": 1,
    "street": "Jln Taman Puteri Jaya 2",
    "city": "Sungai Petani",
    "province": "Kedah",
    "country": "Malaysia",
    "zip_code": "08000"
  }
}
```

Response Body Error:

```json
{
  "errors": "Country required"
}
```

## Get Address API

Endpoint : GET /api/contacts/{contact_id}/addresses/:address_id

Headers :

- Authorization: token

Response Body Success:

```json
{
  "data": {
    "id": 1,
    "street": "Jln Taman Puteri Jaya 2",
    "city": "Sungai Petani",
    "province": "Kedah",
    "country": "Malaysia",
    "zip_code": "08000"
  }
}
```

Response Body Error:

```json
{
  "errors": "Contact not found"
}
```

## Get All Address API

Endpoint : GET /api/contacts/{contact_id}/addresses

Headers :

- Authorization: token

Response Body Success:

```json
{
  "data": [
    {
      "id": 1,
      "street": "Jln Taman Puteri Jaya 2",
      "city": "Sungai Petani",
      "province": "Kedah",
      "country": "Malaysia",
      "zip_code": "08000"
    },
    {
      "id": 2,
      "street": "Jln Taman Puteri Jaya 2",
      "city": "Sungai Petani",
      "province": "Kedah",
      "country": "Malaysia",
      "zip_code": "08000"
    }
  ]
}
```

Response Body Error:

```json
{
  "errors": "Contact not found"
}
```

## Delete Address API

Endpoint : DELETE /api/contacts/{contact_id}/addresses/:address_id

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
