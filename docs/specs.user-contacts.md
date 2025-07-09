# User Contacts Specification API

## Add Contact

Endpoint: POST /api/contacts

Headers:

- Authorization: Token

Request Body:

```json
{
  "first_name": "Agus",
  "last_name": "Sutarom",
  "email": "taroom@gmail.com",
  "phone": "6285700000000"
}
```

Response Body: (Success)

```json
{
  "data": {
    "id": 1,
    "first_name": "Agus",
    "last_name": "Sutarom",
    "email": "taroom@gmail.com",
    "phone": "6285700000000"
  }
}
```

Response Body: (Error)

```json
{
  "errors": "nama depan harus diisi|email harus diisi|phone harus ada"
}
```

## View Contact

Endpoint: GET /api/contacts/:contactId

Headers:

- Authorization: Token

Response Body: (Success)

```json
{
  "data": {
    "id": 1,
    "first_name": "Agus",
    "last_name": "Sutarom",
    "email": "taroom@gmail.com",
    "phone": "6285700000000"
  }
}
```

Response Body: (Error)

```json
{
  "errors": "data tidak ditemukan"
}
```

## Search Contact

Endpoint: GET /api/contacts

Headers:

- Authorization: Token

Query Params:

- name: string, contact first name or contact last name, optional
- email: string, contact email, optional
- phone: string, contact phone, optional
- page: number, default 1
- size: number, default 10

Response Body: (Success)

```json
{
  "data": [
    {
      "id": 1,
      "first_name": "Agus",
      "last_name": "Sutarom",
      "email": "taroom@gmail.com",
      "phone": "6285700000000"
    },
    {
      "id": 2,
      "first_name": "Joko",
      "last_name": "Waluyo",
      "email": "waluyo@gmail.com",
      "phone": "6285700000001"
    },
    {
      "id": 3,
      "first_name": "Herman",
      "last_name": "Syah Zanni",
      "email": "zanni@gmail.com",
      "phone": "6285700000002"
    }
  ],
  "paging": {
    "current_page": 1,
    "total_page": 10,
    "per_page": 10
  }
}
```

## Update Contact

Endpoint: PUT /api/contacts/:contactId

Headers:

- Authorization: Token

Request Body:

```json
{
  "first_name": "Agus",
  "last_name": "Sutarom",
  "email": "taroom@gmail.com",
  "phone": "6285700000000"
}
```

Response Body: (Success)

```json
{
  "data": {
    "id": 1,
    "first_name": "Agus",
    "last_name": "Sutarom",
    "email": "taroom@gmail.com",
    "phone": "6285700000000"
  }
}
```

Response Body: (Error)

```json
{
  "errors": "nama depan harus diisi|email harus diisi|phone harus ada"
}
```

## Delete Contact

Endpoint: DELETE /api/contacts/:contactId

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
