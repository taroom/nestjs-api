# User Specification API

## Register User

Endpoint : POST /api/users/register

Request Body:

```json
{
  "username": "agussutarom",
  "name": "Agus Sutarom",
  "password": "secret"
}
```

Response Body (success):

```json
{
  "data": {
    "username": "agussutarom",
    "name": "Agus Sutarom",
    "token": "session_id_generated_code"
  }
}
```

Response Body (failed):

```json
{
  "errors": "Username sudah digunakan"
}
```

## Login User

Endpoint : POST /api/users

Request Body:

```json
{
  "username": "agussutarom",
  "password": "secret"
}
```

Response Body (success):

```json
{
  "data": {
    "username": "agussutarom",
    "name": "Agus Sutarom",
    "token": "session_id_generated_code"
  }
}
```

Response Body (failed):

```json
{
  "errors": "Username atau password salah"
}
```

## Get User

Endpoint : GET /api/users/current

Headers :

- Authorization: Token

Response Body (success):

```json
{
  "data": {
    "username": "agussutarom",
    "name": "Agus Sutarom"
  }
}
```

Response Body (failed):

```json
{
  "errors": "User tidak ditemukan"
}
```

## Update User

Endpoint : PATCH /api/users/current (patch memungkinkan untuk update data satuan)

Headers :

- Authorization: Token

Request Body:

```json
{
  "username": "agussutarom", //optional jika ingin ubah username
  "password": "secret" //optional jika ingin ubah password
}
```

Response Body (success):

```json
{
  "data": {
    "username": "agussutarom",
    "name": "Agus Sutarom"
  }
}
```

Response Body (failed):

```json
{
  "errors": "password harus 6 karakter|username telah terpakai"
}
```

## Logout User

Endpoint : DELETE /api/users/current

Headers :

- Authorization: Token

Response Body (success):

```json
{
  "data": true
}
```
