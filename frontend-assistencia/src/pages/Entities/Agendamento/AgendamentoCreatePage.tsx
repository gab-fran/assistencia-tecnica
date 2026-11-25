import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import NavBar from '../../../components/NavBar/NavBar';
import Footer from '../../../components/Footer/Footer';
import { DynamicForm, type FieldConfig } from '../../../components/DynamicForm/DynamicForm';
import { ApiError } from '../../../services/apiClient';
import { agendamentoService } from '../../../services/agendamentoService';
import { equipamentoService } from '../../../services/equipamentoService';
import { agendamentoCreateSchema, type AgendamentoCreateFormData } from '../../../schemas/agendamentoSchema';
import { SituacaoAgendamento, situacaoAgendamentoOptions } from '../../../enums/situacaoAgendamento';
import type { EquipamentoResponseDTO } from '../../../types/equipamento';
import styles from '../Create.module.css';

export function AgendamentoCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedEquipamentoId = searchParams.get('idEquipamento');

  const [equipamentos, setEquipamentos] = useState<EquipamentoResponseDTO[]>([]);
  const [loadingEquipamentos, setLoadingEquipamentos] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    equipamentoService
      .listar({ size: 100 })
      .then((res) => {
        setEquipamentos(res.content);
      })
      .catch(() => {
        setError('Não foi possível carregar a lista de equipamentos.');
      })
      .finally(() => setLoadingEquipamentos(false));
  }, []);

  const equipamentoOptions = equipamentos.map((eq) => ({
    label: `${eq.tipo} ${eq.marca} ${eq.modelo} — Cliente: ${eq.cliente?.nome || `#${eq.cliente?.idCliente}`}`,
    value: eq.idEquipamento,
  }));

  const createFields: FieldConfig<AgendamentoCreateFormData>[] = [
    {
      name: 'idEquipamento',
      label: 'Equipamento a ser consertado (Obrigatório)',
      required: true,
      options: equipamentoOptions,
      searchable: true,
      placeholder: loadingEquipamentos ? 'Carregando equipamentos...' : 'Selecione o equipamento',
    },
    {
      name: 'dataAgendamento',
      label: 'Data e Hora do Agendamento',
      type: 'datetime-local',
      required: true,
    },
    {
      name: 'situacaoAgendamento',
      label: 'Situação Inicial',
      required: true,
      options: situacaoAgendamentoOptions,
    },
    {
      name: 'descricao',
      label: 'Descrição do Problema / Observações',
      maxLength: 255,
      placeholder: 'Ex: Tela quebrada, não liga após queda, etc.',
    },
  ];

  const handleCreate = async (data: AgendamentoCreateFormData) => {
    setError('');
    try {
      const created = await agendamentoService.cadastrar(data);
      navigate(`/agendamento/${created.idAgendamento}`);
    } catch (requestError: unknown) {
      setError(
        requestError instanceof ApiError ? requestError.message : 'Não foi possível cadastrar o agendamento.'
      );
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
          <h1 className={styles.headerTitle}>Novo Agendamento</h1>
          <p className={styles.headerSubtitle}>
            Agende uma manutenção preventiva ou corretiva para um equipamento cadastrado.
          </p>
        </div>

        {error && <p className={styles.errorMessage} role="alert">{error}</p>}

        {loadingEquipamentos ? (
          <p>Carregando equipamentos disponíveis...</p>
        ) : equipamentos.length === 0 ? (
          <div className={styles.errorMessage}>
            É necessário ter pelo menos um equipamento cadastrado para criar um agendamento.
            <div style={{ marginTop: '0.75rem' }}>
              <Link to="/equipamentos/novo" style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                Clique aqui para cadastrar um equipamento primeiro →
              </Link>
            </div>
          </div>
        ) : (
          <DynamicForm
            schema={agendamentoCreateSchema}
            fields={createFields}
            defaultValues={{
              idEquipamento: preselectedEquipamentoId ? Number(preselectedEquipamentoId) : undefined,
              situacaoAgendamento: SituacaoAgendamento.PENDENTE,
            }}
            onSubmit={handleCreate}
            submitText="Confirmar Agendamento"
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
