import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import NavBar from '../../../components/NavBar/NavBar';
import Footer from '../../../components/Footer/Footer';
import { DynamicForm, type FieldConfig } from '../../../components/DynamicForm/DynamicForm';
import { ApiError } from '../../../services/apiClient';
import { equipamentoService } from '../../../services/equipamentoService';
import { clienteService } from '../../../services/clienteService';
import { equipamentoCreateSchema, type EquipamentoCreateFormData } from '../../../schemas/equipamentoSchema';
import type { ClienteResponseDTO } from '../../../types/cliente';
import { formatCpf } from '../../../utils/formatters';
import styles from '../Create.module.css';

export function EquipamentoCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedClienteId = searchParams.get('idCliente');

  const [clientes, setClientes] = useState<ClienteResponseDTO[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    clienteService
      .listar({ size: 100 })
      .then((res) => {
        setClientes(res.content);
      })
      .catch(() => {
        setError('Não foi possível carregar a lista de clientes para vincular ao equipamento.');
      })
      .finally(() => setLoadingClientes(false));
  }, []);

  const clienteOptions = clientes.map((c) => ({
    label: `${c.nome} (CPF: ${formatCpf(c.cpf)})`,
    value: c.idCliente,
  }));

  const createFields: FieldConfig<EquipamentoCreateFormData>[] = [
    {
      name: 'idCliente',
      label: 'Cliente Proprietário (Obrigatório)',
      required: true,
      options: clienteOptions,
      searchable: true,
      placeholder: loadingClientes ? 'Carregando clientes...' : 'Selecione o cliente responsável',
    },
    {
      name: 'tipo',
      label: 'Tipo de Equipamento',
      required: true,
      maxLength: 25,
      placeholder: 'Ex: Notebook, Smartphone, Console, Monitor...',
    },
    {
      name: 'marca',
      label: 'Marca',
      required: true,
      maxLength: 25,
      placeholder: 'Ex: Dell, Apple, Samsung, Lenovo...',
    },
    {
      name: 'modelo',
      label: 'Modelo',
      required: true,
      maxLength: 25,
      placeholder: 'Ex: Inspiron 15, Galaxy S23, PS5...',
    },
    {
      name: 'numeroSerie',
      label: 'Número de Série (Opcional)',
      maxLength: 25,
      placeholder: 'Ex: SN1234567890',
    },
  ];

  const handleCreate = async (data: EquipamentoCreateFormData) => {
    setError('');
    try {
      const created = await equipamentoService.cadastrar(data);
      navigate(`/equipamentos/${created.idEquipamento}`);
    } catch (requestError: unknown) {
      setError(
        requestError instanceof ApiError ? requestError.message : 'Não foi possível cadastrar o equipamento.'
      );
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
          <h1 className={styles.headerTitle}>Novo Equipamento</h1>
          <p className={styles.headerSubtitle}>
            Cadastre um novo dispositivo associando-o obrigatoriamente a um cliente da assistência.
          </p>
        </div>

        {error && <p className={styles.errorMessage} role="alert">{error}</p>}

        {loadingClientes ? (
          <p>Carregando clientes cadastrados...</p>
        ) : clientes.length === 0 ? (
          <div className={styles.errorMessage}>
            É necessário ter pelo menos um cliente cadastrado para registrar um equipamento.
            <div style={{ marginTop: '0.75rem' }}>
              <Link to="/clientes/novo" style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                Clique aqui para cadastrar um cliente primeiro →
              </Link>
            </div>
          </div>
        ) : (
          <DynamicForm
            schema={equipamentoCreateSchema}
            fields={createFields}
            defaultValues={{
              idCliente: preselectedClienteId ? Number(preselectedClienteId) : undefined,
            }}
            onSubmit={handleCreate}
            submitText="Salvar Equipamento"
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
