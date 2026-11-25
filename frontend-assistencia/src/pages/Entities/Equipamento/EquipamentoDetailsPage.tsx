import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import NavBar from '../../../components/NavBar/NavBar';
import Footer from '../../../components/Footer/Footer';
import { DynamicForm, type FieldConfig } from '../../../components/DynamicForm/DynamicForm';
import { ApiError } from '../../../services/apiClient';
import { equipamentoService } from '../../../services/equipamentoService';
import { clienteService } from '../../../services/clienteService';
import type { EquipamentoResponseDTO } from '../../../types/equipamento';
import type { ClienteResponseDTO } from '../../../types/cliente';
import { equipamentoUpdateSchema, type EquipamentoUpdateFormData } from '../../../schemas/equipamentoSchema';
import { formatCpf } from '../../../utils/formatters';
import styles from '../Details.module.css';

type EquipamentoDetailsPageProps = {
  edit?: boolean;
};

export function EquipamentoDetailsPage({ edit = false }: EquipamentoDetailsPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipamento, setEquipamento] = useState<EquipamentoResponseDTO | null>(null);
  const [clientes, setClientes] = useState<ClienteResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const equipamentoId = Number(id);
  const invalidId = !Number.isInteger(equipamentoId) || equipamentoId <= 0;

  useEffect(() => {
    if (invalidId) return;

    Promise.all([
      equipamentoService.buscarPorId(equipamentoId),
      clienteService.listar({ size: 100 }),
    ])
      .then(([eq, clRes]) => {
        setEquipamento(eq);
        setClientes(clRes.content);
      })
      .catch((requestError: unknown) => {
        setError(requestError instanceof ApiError ? requestError.message : 'Não foi possível carregar o equipamento.');
      })
      .finally(() => setLoading(false));
  }, [invalidId, equipamentoId]);

  const clienteOptions = clientes.map((c) => ({
    label: `${c.nome} (CPF: ${formatCpf(c.cpf)})`,
    value: c.idCliente,
  }));

  const updateFields: FieldConfig<EquipamentoUpdateFormData>[] = [
    {
      name: 'idCliente',
      label: 'Cliente Proprietário',
      options: clienteOptions,
      searchable: true,
      required: false,
    },
    { name: 'tipo', label: 'Tipo de Equipamento', required: true, maxLength: 25 },
    { name: 'marca', label: 'Marca', required: true, maxLength: 25 },
    { name: 'modelo', label: 'Modelo', required: true, maxLength: 25 },
    { name: 'numeroSerie', label: 'Número de Série', maxLength: 25 },
  ];

  const handleUpdate = async (data: EquipamentoUpdateFormData) => {
    if (!equipamento) return;
    setError('');

    try {
      const updated = await equipamentoService.atualizar(equipamento.idEquipamento, data);
      setEquipamento(updated);
      navigate(`/equipamentos/${equipamento.idEquipamento}`);
    } catch (requestError: unknown) {
      setError(requestError instanceof ApiError ? requestError.message : 'Não foi possível atualizar o equipamento.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <NavBar />
      <main className={styles.pageMain}>
        <div className={styles.headerSection}>
          <Link to="/equipamentos" className={styles.backLink}>
            ← Voltar para equipamentos
          </Link>
          <h1 className={styles.headerTitle}>
            {edit ? 'Editar Equipamento' : 'Detalhes do Equipamento'}
          </h1>
        </div>

        {invalidId && <p className={styles.errorMessage} role="alert">Identificador de equipamento inválido.</p>}
        {!invalidId && loading && <p>Carregando dados do equipamento...</p>}
        {error && <p className={styles.errorMessage} role="alert">{error}</p>}

        {!invalidId && !loading && equipamento && (
          edit ? (
            <DynamicForm
              schema={equipamentoUpdateSchema}
              fields={updateFields}
              defaultValues={{
                tipo: equipamento.tipo,
                marca: equipamento.marca,
                modelo: equipamento.modelo,
                numeroSerie: equipamento.numeroSerie || '',
                idCliente: equipamento.cliente?.idCliente,
              }}
              onSubmit={handleUpdate}
              submitText="Salvar Alterações"
            />
          ) : (
            <div className={styles.cardContainer}>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>ID do Equipamento</span>
                <span className={styles.infoValue}>#{equipamento.idEquipamento}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Tipo</span>
                <span className={styles.infoValue}>{equipamento.tipo}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Marca & Modelo</span>
                <span className={styles.infoValue}>{equipamento.marca} — {equipamento.modelo}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Número de Série</span>
                <span className={styles.infoValue}>{equipamento.numeroSerie || 'Não informado'}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Cliente Proprietário</span>
                <span className={styles.infoValue}>
                  {equipamento.cliente?.nome ? (
                    <Link to={`/clientes/${equipamento.cliente.idCliente}`} style={{ fontWeight: 600 }}>
                      {equipamento.cliente.nome} (ID #{equipamento.cliente.idCliente})
                    </Link>
                  ) : (
                    'Cliente não identificado'
                  )}
                </span>
              </div>

              <div className={styles.cardActions}>
                <Link to={`/equipamentos/${equipamento.idEquipamento}/editar`} className={styles.primaryButton}>
                  Editar Equipamento
                </Link>
                <Link to={`/agendamento/novo?idEquipamento=${equipamento.idEquipamento}`} className={styles.secondaryButton}>
                  + Agendar Manutenção
                </Link>
              </div>
            </div>
          )
        )}
      </main>
      <Footer />
    </div>
  );
}
