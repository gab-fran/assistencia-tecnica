import type { RoleUsuario } from '../enums/roleUsuario';

export interface UsuarioResponseDTO {
  idUsuario: number;
  nome: string;
  email: string;
  role: RoleUsuario | string;
  statusUsuario?: boolean;
}

export interface UsuarioCreateDTO {
  nome: string;
  email: string;
  senha: string;
  role?: RoleUsuario | string;
}

export interface UsuarioUpdateDTO {
  nome: string;
  email: string;
  role: RoleUsuario | string;
}

export interface AlterarSenhaDTO {
  senhaAtual: string;
  novaSenha: string;
}
