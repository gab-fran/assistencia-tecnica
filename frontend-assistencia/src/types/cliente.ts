export interface ClienteResponseDTO {
  idCliente: number;
  nome: string;
  email: string;
  cpf: string;
  celular: string;
  statusCliente?: boolean;
}

export interface ClienteResumoDTO {
  idCliente: number;
  nome: string;
}

export interface ClienteCreateDTO {
  nome: string;
  email: string;
  cpf: string;
  celular: string;
}

export interface ClienteUpdateDTO {
  nome?: string;
  email?: string;
  cpf?: string;
  celular?: string;
}
