import { createElement } from 'react';
import type { ListColumn } from '../components/DynamicList/DynamicList';
import type { UsuarioResponseDTO } from '../types/usuario';
import { z } from 'zod';
import { RoleUsuario } from '../enums/roleUsuario';

export const usuarioListColumns: ListColumn<UsuarioResponseDTO>[] = [
  { key: 'nome', header: 'Nome' },
  { key: 'email', header: 'E-mail' },
  {
    key: 'role',
    header: 'Perfil',
    render: (item) =>
      createElement(
        'span',
        {
          style: {
            display: 'inline-block',
            padding: '0.25rem 0.65rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            backgroundColor: item.role === RoleUsuario.ADMINISTRADOR ? 'rgba(99, 102, 241, 0.1)' : 'rgba(37, 99, 235, 0.08)',
            color: item.role === RoleUsuario.ADMINISTRADOR ? '#4f46e5' : '#2563eb',
            border: item.role === RoleUsuario.ADMINISTRADOR ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid rgba(37, 99, 235, 0.2)',
          },
        },
        item.role === RoleUsuario.ADMINISTRADOR ? 'Administrador' : 'Funcionário'
      ),
  },
];

export const usuarioUpdateSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório.').max(100, 'Máximo de 100 caracteres.'),
  email: z.string().min(1, 'O e-mail é obrigatório.').email('Informe um e-mail válido.'),
  role: z.enum([RoleUsuario.ADMINISTRADOR, RoleUsuario.FUNCIONARIO] as const, {
    message: 'Selecione um perfil válido.',
  }),
});

export const usuarioCreateSchema = usuarioUpdateSchema.extend({
  senha: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres.'),
});

export const usuarioSenhaSchema = z.object({
  senhaAtual: z.string().min(1, 'A senha atual é obrigatória.'),
  novaSenha: z.string().min(8, 'A nova senha deve ter no mínimo 8 caracteres.'),
});

export type UsuarioSenhaFormData = z.infer<typeof usuarioSenhaSchema>;
export type UsuarioUpdateFormData = z.infer<typeof usuarioUpdateSchema>;
export type UsuarioCreateFormData = z.infer<typeof usuarioCreateSchema>;

export const roleUsuarioOptions = [
  { label: 'Administrador', value: RoleUsuario.ADMINISTRADOR },
  { label: 'Funcionário', value: RoleUsuario.FUNCIONARIO },
] as const;
