import type { Page, PageRequest } from '../types/api';
import type { AlterarSenhaDTO, UsuarioCreateDTO, UsuarioResponseDTO, UsuarioUpdateDTO } from '../types/usuario';
import { endpoints } from '../utils/endpoints';
import { apiRequest } from './apiClient';

export const usuarioService = {
  listar: (params?: PageRequest) =>
    apiRequest<Page<UsuarioResponseDTO>>(endpoints.usuarios.base, {
      method: 'GET',
      query: params,
    }),

  buscarPorId: (id: number) =>
    apiRequest<UsuarioResponseDTO>(endpoints.usuarios.byId(id), {
      method: 'GET',
    }),

  buscarPorEmail: (email: string) =>
    apiRequest<UsuarioResponseDTO>(endpoints.usuarios.byEmail(email), {
      method: 'GET',
    }),

  cadastrar: (dados: UsuarioCreateDTO) =>
    apiRequest<UsuarioResponseDTO>(endpoints.usuarios.base, {
      method: 'POST',
      body: dados,
    }),

  atualizar: (id: number, dados: UsuarioUpdateDTO) =>
    apiRequest<UsuarioResponseDTO>(endpoints.usuarios.byId(id), {
      method: 'PUT',
      body: dados,
    }),

  alterarSenha: (id: number, dados: AlterarSenhaDTO) =>
    apiRequest<void>(endpoints.usuarios.senha(id), {
      method: 'PUT',
      body: dados,
    }),

  remover: (id: number) =>
    apiRequest<string>(endpoints.usuarios.byId(id), {
      method: 'DELETE',
    }),
};
