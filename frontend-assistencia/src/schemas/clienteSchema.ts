import { z } from 'zod';
import type { ListColumn } from '../components/DynamicList/DynamicList';
import type { ClienteResponseDTO } from '../types/cliente';
import { formatCpf, formatCelular } from '../utils/formatters';

export const clienteListColumns: ListColumn<ClienteResponseDTO>[] = [
  { key: 'nome', header: 'Nome' },
  { key: 'email', header: 'E-mail' },
  {
    key: 'cpf',
    header: 'CPF',
    render: (item) => formatCpf(item.cpf),
  },
  {
    key: 'celular',
    header: 'Celular',
    render: (item) => formatCelular(item.celular),
  },
];

export const clienteCreateSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório.').max(20, 'O nome deve ter no máximo 20 caracteres.'),
  email: z.string().min(1, 'O e-mail é obrigatório.').email('E-mail inválido.').max(255, 'Máximo 255 caracteres.'),
  cpf: z
    .string()
    .min(1, 'O CPF é obrigatório.')
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length === 11, 'O CPF deve conter exatamente 11 dígitos numéricos.'),
  celular: z
    .string()
    .min(1, 'O celular é obrigatório.')
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length === 11, 'O celular deve conter exatamente 11 dígitos numéricos.'),
});

export const clienteUpdateSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório.').max(20, 'O nome deve ter no máximo 20 caracteres.').optional(),
  email: z.string().email('E-mail inválido.').max(255, 'Máximo 255 caracteres.').optional().or(z.literal('')),
  cpf: z
    .string()
    .optional()
    .transform((val) => (val ? val.replace(/\D/g, '') : ''))
    .refine((val) => !val || val.length === 11, 'O CPF deve conter 11 dígitos numéricos.'),
  celular: z
    .string()
    .optional()
    .transform((val) => (val ? val.replace(/\D/g, '') : ''))
    .refine((val) => !val || val.length === 11, 'O celular deve conter 11 dígitos numéricos.'),
});

export type ClienteCreateFormData = z.infer<typeof clienteCreateSchema>;
export type ClienteUpdateFormData = z.infer<typeof clienteUpdateSchema>;
