export class RegisterUserRequest {
  username: string;
  password: string;
  name: string;
}

export class UserResponse {
  // coba lihat lagi specnya  disitu kembalian response success selalu sama
  username: string;
  name: string;
  token?: string; //tidak harus ada, beberapa response tidak wajib
}

export class LoginUserRequest {
  username: string;
  password: string;
}

export class UpdateUserRequest {
  // pembatasan pengubahan data pada password (optional) atau name (optional)
  password?: string;
  name?: string;
}
