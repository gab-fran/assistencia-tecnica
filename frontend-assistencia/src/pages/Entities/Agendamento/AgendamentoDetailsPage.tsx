import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import NavBar from '../../../components/NavBar/NavBar';
import Footer from '../../../components/Footer/Footer';
import { DynamicForm, type FieldConfig } from '../../../components/DynamicForm/DynamicForm';
import { ApiError } from '../../../services/apiClient';
import { agendamentoService } from '../../../services/agendamentoService';
import { equipamentoService } from '../../../services/equipamentoService';
import type { AgendamentoResponseDTO } from '../../../types/agendamento';
import type { EquipamentoResponseDTO } from '../../../types/equipamento';
import { agendamentoUpdateSchema, type AgendamentoUpdateFormData } from '../../../schemas/agendamentoSchema';
import { situacaoAgendamentoOptions } from '../../../enums/situacaoAgendamento';
import { formatDateTime, getSituacaoBadgeColor, getSituacaoLabel } from '../../../utils/formatters';
import styles from '../Details.module.css';

type AgendamentoDetailsPageProps = {
  edit?: boolean;
};

export function AgendamentoDetailsPage({ edit = false }: AgendamentoDetailsPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agendamento, setAgendamento] = useState<AgendamentoResponseDTO | null>(null);
  const [equipamentoCompleto, setEquipamentoCompleto] = useState<EquipamentoResponseDTO | null>(null);
  const [equipamentos, setEquipamentos] = useState<EquipamentoResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const agendamentoId = Number(id);
  const invalidId = !Number.isInteger(agendamentoId) || agendamentoId <= 0;

  useEffect(() => {
    if (invalidId) return;

    agendamentoService
      .buscarPorId(agendamentoId)
      .then(async (ag) => {
        setAgendamento(ag);
        if (ag.equipamento?.idEquipamento) {
          try {
            const eq = await equipamentoService.buscarPorId(ag.equipamento.idEquipamento);
            setEquipamentoCompleto(eq);
          } catch {
            // ignore
          }
        }
      })
      .catch((requestError: unknown) => {
        setError(requestError instanceof ApiError ? requestError.message : 'Não foi possível carregar o agendamento.');
      })
      .finally(() => setLoading(false));

    if (edit) {
      equipamentoService.listar({ size: 100 }).then((res) => setEquipamentos(res.content)).catch(() => {});
    }
  }, [invalidId, agendamentoId, edit]);

  const equipamentoOptions = equipamentos.map((eq) => ({
    label: `${eq.tipo} ${eq.marca} ${eq.modelo} (Cliente: ${eq.cliente?.nome || '#' + eq.cliente?.idCliente})`,
    value: eq.idEquipamento,
  }));

  const updateFields: FieldConfig<AgendamentoUpdateFormData>[] = [
    {
      name: 'dataAgendamento',
      label: 'Data e Hora do Agendamento (Requisito 7.2)',
      type: 'datetime-local',
      required: true,
    },
    {
      name: 'situacaoAgendamento',
      label: 'Situação do Atendimento',
      required: true,
      options: situacaoAgendamentoOptions,
    },
    {
      name: 'idEquipamento',
      label: 'Equipamento',
      options: equipamentoOptions,
      searchable: true,
      required: false,
    },
    {
      name: 'descricao',
      label: 'Descrição / Defeito Relatado',
      maxLength: 255,
      placeholder: 'Observações sobre o defeito e serviço realizado',
    },
  ];

  const handleUpdate = async (data: AgendamentoUpdateFormData) => {
    if (!agendamento) return;
    setError('');

    try {
      const updated = await agendamentoService.atualizar(agendamento.idAgendamento, data);
      setAgendamento(updated);
      navigate(`/agendamento/${agendamento.idAgendamento}`);
    } catch (requestError: unknown) {
      setError(requestError instanceof ApiError ? requestError.message : 'Não foi possível atualizar o agendamento.');
    }
  };

  const formatLocalIso = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    } catch {
      return isoStr;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <NavBar />
      <main className={styles.pageMain}>
        <div className={styles.headerSection}>
          <Link to="/agendamento" className={styles.backLink}>
            ← Voltar para agendamentos
          </Link>
          <h1 className={styles.headerTitle}>
            {edit ? 'Atualizar Agendamento' : 'Ordem de Agendamento'}
          </h1>
        </div>

        {invalidId && <p className={styles.errorMessage} role="alert">Identificador de agendamento inválido.</p>}
        {!invalidId && loading && <p>Carregando dados do agendamento...</p>}
        {error && <p className={styles.errorMessage} role="alert">{error}</p>}

        {!invalidId && !loading && agendamento && (
          edit ? (
            <DynamicForm
              schema={agendamentoUpdateSchema}
              fields={updateFields}
              defaultValues={{
                dataAgendamento: formatLocalIso(agendamento.dataAgendamento),
                situacaoAgendamento: agendamento.situacaoAgendamento,
                descricao: agendamento.descricao || '',
                idEquipamento: agendamento.equipamento?.idEquipamento,
              }}
              onSubmit={handleUpdate}
              submitText="Salvar Modificação"
            />
          ) : (
            <div className={styles.cardContainer}>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Código do Agendamento</span>
                <span className={styles.infoValue}>#{agendamento.idAgendamento}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Data e Horário</span>
                <span className={styles.infoValue} style={{ fontWeight: 700 }}>
                  {formatDateTime(agendamento.dataAgendamento)}
                </span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Situação do Agendamento</span>
                <span className={styles.infoValue}>
                  {(() => {
                    const colors = getSituacaoBadgeColor(agendamento.situacaoAgendamento);
                    return (
                      <span
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.color,
                          border: `1px solid ${colors.border}`,
                          padding: '0.35rem 0.85rem',
                          borderRadius: '9999px',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          display: 'inline-block',
                        }}
                      >
                        {getSituacaoLabel(agendamento.situacaoAgendamento)}
                      </span>
                    );
                  })()}
                </span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Equipamento</span>
                <span className={styles.infoValue}>
                  {agendamento.equipamento ? (
                    <Link to={`/equipamentos/${agendamento.equipamento.idEquipamento}`} style={{ fontWeight: 600 }}>
                      {agendamento.equipamento.tipo} — {agendamento.equipamento.marca} {agendamento.equipamento.modelo} (ID #{agendamento.equipamento.idEquipamento})
                    </Link>
                  ) : (
                    'Equipamento não associado'
                  )}
                </span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Cliente Proprietário</span>
                <span className={styles.infoValue}>
                  {equipamentoCompleto?.cliente ? (
                    <Link to={`/clientes/${equipamentoCompleto.cliente.idCliente}`} style={{ fontWeight: 600 }}>
                      {equipamentoCompleto.cliente.nome} (ID #{equipamentoCompleto.cliente.idCliente})
                    </Link>
                  ) : (
                    'Consultando cliente...'
                  )}
                </span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Descrição do Problema / Defeito</span>
                <span className={styles.infoValue}>{agendamento.descricao || 'Nenhuma observação informada.'}</span>
              </div>

              <div className={styles.cardActions}>
                <Link to={`/agendamento/${agendamento.idAgendamento}/editar`} className={styles.primaryButton}>
                  Atualizar Data / Detalhes
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
