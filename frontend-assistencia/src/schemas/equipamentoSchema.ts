import { z } from 'zod';
import type { ListColumn } from '../components/DynamicList/DynamicList';
import type { EquipamentoResponseDTO } from '../types/equipamento';

export const equipamentoListColumns: ListColumn<EquipamentoResponseDTO>[] = [
  { key: 'tipo', header: 'Tipo' },
  { key: 'marca', header: 'Marca' },
  { key: 'modelo', header: 'Modelo' },
  {
    key: 'numeroSerie',
    header: 'Nº Série',
    render: (item) => item.numeroSerie || '—',
  },
  {
    key: 'cliente',
    header: 'Cliente Proprietário',
    render: (item) => item.cliente?.nome || `Cliente #${item.cliente?.idCliente || '—'}`,
  },
];

export const equipamentoCreateSchema = z.object({
  tipo: z.string().min(1, 'O tipo é obrigatório.').max(25, 'Máximo 25 caracteres.'),
  marca: z.string().min(1, 'A marca é obrigatória.').max(25, 'Máximo 25 caracteres.'),
  modelo: z.string().min(1, 'O modelo é obrigatório.').max(25, 'Máximo 25 caracteres.'),
  numeroSerie: z.string().max(25, 'Máximo 25 caracteres.').optional().or(z.literal('')),
  idCliente: z.coerce.number({ message: 'Selecione um cliente.' }).min(1, 'O cliente proprietário é obrigatório.'),
});

export const equipamentoUpdateSchema = z.object({
  tipo: z.string().min(1, 'O tipo é obrigatório.').max(25, 'Máximo 25 caracteres.').optional(),
  marca: z.string().min(1, 'A marca é obrigatória.').max(25, 'Máximo 25 caracteres.').optional(),
  modelo: z.string().min(1, 'O modelo é obrigatório.').max(25, 'Máximo 25 caracteres.').optional(),
  numeroSerie: z.string().max(25, 'Máximo 25 caracteres.').optional().or(z.literal('')),
  idCliente: z.coerce.number().optional(),
});

export type EquipamentoCreateFormData = z.infer<typeof equipamentoCreateSchema>;
export type EquipamentoUpdateFormData = z.infer<typeof equipamentoUpdateSchema>;
