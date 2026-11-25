import type { LoginRequest, LoginResponse } from '../types/auth';
import type { UsuarioCreateDTO, UsuarioResponseDTO } from '../types/usuario';
import { endpoints } from '../utils/endpoints';
import { apiRequest } from './apiClient';
import { clearAccessToken, getAccessToken, setAccessToken, setUserData } from './apiConfig';

export const authService = {
  async login(dados: LoginRequest): Promise<LoginResponse> {
    const payload = {
      email: dados.email,
      senha: dados.senha ?? dados.password,
    };
    const resposta = await apiRequest<LoginResponse>(endpoints.auth.login, {
      method: 'POST',
      body: payload,
      authenticated: false,
    });

    setAccessToken(resposta.token);

    if (resposta && resposta.token) {
      try {
        const usuario = await apiRequest<UsuarioResponseDTO>(endpoints.usuarios.byEmail(dados.email), {
          method: 'GET',
          authenticated: true,
        });
        setUserData(usuario);
      } catch {
        // Fallback: extract user data from JWT token if byEmail endpoint is protected or fails
        try {
          const tokenPayload = JSON.parse(atob(resposta.token.split('.')[1]));
          setUserData({
            idUsuario: Number(tokenPayload.id) || 0,
            nome: tokenPayload.sub?.split('@')[0] || 'Usuário',
            email: tokenPayload.sub || dados.email,
            role: tokenPayload.role || 'FUNCIONARIO',
            statusUsuario: true,
          });
        } catch {
          // ignore
        }
      }
    }

    return resposta;
  },

  registrar: (dados: UsuarioCreateDTO) =>
    apiRequest<UsuarioResponseDTO>(endpoints.auth.register, {
      method: 'POST',
      body: dados,
      authenticated: false,
    }),

  logout: clearAccessToken,

  checkTokenExpiry(): boolean {
    const token = getAccessToken();

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp;
        const now = Math.floor(Date.now() / 1000);

        if (expiry && expiry < now) {
          this.logout();
          return false;
        }
        return true;
      } catch {
        this.logout();
        return false;
      }
    }
    return false;
  },
};
