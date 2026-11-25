export interface LoginRequest {
  email: string;
  senha?: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  type: string;
}
