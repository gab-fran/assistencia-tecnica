export const endpoints = {
  home: '/',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  usuarios: {
    base: '/usuarios',
    byId: (id: number) => `/usuarios/${id}`,
    byEmail: (email: string) => `/usuarios/por-email/${encodeURIComponent(email)}`,
    senha: (id: number) => `/usuarios/${id}/senha`,
  },
  clientes: {
    base: '/clientes',
    byId: (id: number) => `/clientes/${id}`,
    byEmail: (email: string) => `/clientes/email/${encodeURIComponent(email)}`,
    byCpf: (cpf: string) => `/clientes/cpf/${encodeURIComponent(cpf)}`,
  },
  equipamentos: {
    base: '/equipamentos',
    byId: (id: number) => `/equipamentos/${id}`,
    byCliente: (idCliente: number) => `/equipamentos/cliente/${idCliente}`,
    byNumeroSerie: (numeroSerie: string) => `/equipamentos/numeroSerie/${encodeURIComponent(numeroSerie)}`,
  },
  agendamento: {
    base: '/agendamento',
    byId: (id: number) => `/agendamento/${id}`,
  },
} as const;
