# User Addresses Specification API

## Add Address

Endpoint: POST /api/contacts/:contactId/addresses

Headers:

- Authorization: Token

Request Body:

```json
{
  "street": "Jalan Contoh, Optional",
  "city ": "Kota, Optional",
  "province": "Provinsi, Optional",
  "country": "Indonesia",
  "postal_code": "35213"
}
```

Response Body: (Success)

```json
{
  "data": {
    "id": 1,
    "street": "Jalan Contoh, Optional",
    "city ": "Kota, Optional",
    "province": "Provinsi, Optional",
    "country": "Indonesia",
    "postal_code": "35213"
  }
}
```

Response Body: (Error)

```json
{
  "errors": "country harus diisi|postal code harus diisi"
}
```

## View Address

Endpoint: GET /api/contacts/:contactId/addresses/:addressId

Headers:

- Authorization: Token

Response Body: (Success)

```json
{
  "data": {
    "id": 1,
    "street": "Jalan Contoh, Optional",
    "city ": "Kota, Optional",
    "province": "Provinsi, Optional",
    "country": "Indonesia",
    "postal_code": "35213"
  }
}
```

Response Body: (Error)

```json
{
  "errors": "data tidak ditemukan"
}
```

## Update Address

Endpoint: PUT /api/contacts/:contactId/addresses/:addressId

Headers:

- Authorization: Token

Request Body:

```json
{
  "street": "Jalan Contoh, Optional",
  "city ": "Kota, Optional",
  "province": "Provinsi, Optional",
  "country": "Indonesia",
  "postal_code": "35213"
}
```

Response Body: (Success)

```json
{
  "data": {
    "id": 1,
    "street": "Jalan Contoh, Optional",
    "city ": "Kota, Optional",
    "province": "Provinsi, Optional",
    "country": "Indonesia",
    "postal_code": "35213"
  }
}
```

Response Body: (Error)

```json
{
  "errors": "nama depan harus diisi|email harus diisi|phone harus ada"
}
```

## Delete Address

Endpoint: DELETE /api/contacts/:contactId/addresses/:addressId

Headers:

- Authorization: Token

Response Body: (Success)

```json
{
  "data": true
}
```

Response Body: (Error)

```json
{
  "errors": "data tidak ditemukan"
}
```

## Addresses List

Endpoint: GET /api/contacts/:contactId/addresses

Headers:

- Authorization: Token

Response Body: (Success)

```json
{
  "data": [
    {
      "id": 1,
      "street": "Jalan Contoh, Optional",
      "city ": "Kota, Optional",
      "province": "Provinsi, Optional",
      "country": "Indonesia",
      "postal_code": "35213"
    },
    {
      "id": 2,
      "street": "Jalan Contoh, Optional",
      "city ": "Kota, Optional",
      "province": "Provinsi, Optional",
      "country": "Indonesia",
      "postal_code": "35213"
    }
  ]
}
```

Response Body: (Error)

```json
{
  "errors": "data tidak ditemukan"
}
```
