export const RoleUsuario = {
  ADMINISTRADOR: 'ADMINISTRADOR',
  FUNCIONARIO: 'FUNCIONARIO',
} as const;

export type RoleUsuario = (typeof RoleUsuario)[keyof typeof RoleUsuario];
