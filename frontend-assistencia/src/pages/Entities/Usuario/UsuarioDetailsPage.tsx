import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import NavBar from '../../../components/NavBar/NavBar';
import Footer from '../../../components/Footer/Footer';
import { DynamicForm, type FieldConfig } from '../../../components/DynamicForm/DynamicForm';
import { ApiError } from '../../../services/apiClient';
import { usuarioService } from '../../../services/usuarioService';
import type { UsuarioResponseDTO } from '../../../types/usuario';
import {
  roleUsuarioOptions,
  usuarioSenhaSchema,
  usuarioUpdateSchema,
  type UsuarioSenhaFormData,
  type UsuarioUpdateFormData,
} from '../../../schemas/usuarioSchema';
import { RoleUsuario } from '../../../enums/roleUsuario';
import styles from '../Details.module.css';

type UsuarioDetailsPageProps = {
  edit?: boolean;
};

export function UsuarioDetailsPage({ edit = false }: UsuarioDetailsPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<UsuarioResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const usuarioId = Number(id);
  const invalidId = !Number.isInteger(usuarioId) || usuarioId <= 0;

  useEffect(() => {
    if (invalidId) return;

    usuarioService
      .buscarPorId(usuarioId)
      .then(setUsuario)
      .catch((requestError: unknown) => {
        setError(requestError instanceof ApiError ? requestError.message : 'Não foi possível carregar o usuário.');
      })
      .finally(() => setLoading(false));
  }, [invalidId, usuarioId]);

  const updateFields: FieldConfig<UsuarioUpdateFormData>[] = [
    { name: 'nome', label: 'Nome Completo', required: true, maxLength: 100 },
    { name: 'email', label: 'E-mail', type: 'email', required: true },
    { name: 'role', label: 'Perfil de Acesso', required: true, options: roleUsuarioOptions },
  ];

  const senhaFields: FieldConfig<UsuarioSenhaFormData>[] = [
    { name: 'senhaAtual', label: 'Senha Atual', type: 'password', required: true },
    { name: 'novaSenha', label: 'Nova Senha (mínimo 8 caracteres)', type: 'password', required: true, minLength: 8 },
  ];

  const handleUpdate = async (data: UsuarioUpdateFormData) => {
    if (!usuario) return;
    setError('');

    try {
      const updated = await usuarioService.atualizar(usuario.idUsuario, data);
      setUsuario(updated);
      navigate(`/usuarios/${usuario.idUsuario}`);
    } catch (requestError: unknown) {
      setError(requestError instanceof ApiError ? requestError.message : 'Não foi possível atualizar o usuário.');
    }
  };

  const handleAlterarSenha = async (data: UsuarioSenhaFormData) => {
    if (!usuario) return;
    setPasswordSuccess('');
    setPasswordError('');

    try {
      await usuarioService.alterarSenha(usuario.idUsuario, data);
      setPasswordSuccess('Senha alterada com sucesso!');
    } catch (passErr: unknown) {
      setPasswordError(
        passErr instanceof ApiError ? passErr.message : 'Erro ao alterar senha. Verifique a senha atual.'
      );
    }
  };

  return (
    <div className={styles.pageContainer}>
      <NavBar />
      <main className={styles.pageMain}>
        <div className={styles.headerSection}>
          <Link to="/usuarios" className={styles.backLink}>
            ← Voltar para usuários
          </Link>
          <h1 className={styles.headerTitle}>
            {edit ? 'Editar Dados do Usuário' : 'Detalhes do Usuário'}
          </h1>
        </div>

        {invalidId && <p className={styles.errorMessage} role="alert">Identificador de usuário inválido.</p>}
        {!invalidId && loading && <p>Carregando dados do usuário...</p>}
        {error && <p className={styles.errorMessage} role="alert">{error}</p>}

        {!invalidId && !loading && usuario && (
          edit ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <DynamicForm
                schema={usuarioUpdateSchema}
                fields={updateFields}
                defaultValues={{
                  nome: usuario.nome,
                  email: usuario.email,
                  role: usuario.role as RoleUsuario,
                }}
                onSubmit={handleUpdate}
                submitText="Salvar Alterações"
              />

              <div className={styles.cardContainer}>
                <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-primary)' }}>
                  Alterar Senha do Usuário
                </h2>
                {passwordSuccess && (
                  <p style={{ color: 'var(--color-success)', fontWeight: 600 }}>{passwordSuccess}</p>
                )}
                {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}
                <DynamicForm
                  schema={usuarioSenhaSchema}
                  fields={senhaFields}
                  onSubmit={handleAlterarSenha}
                  submitText="Atualizar Senha"
                />
              </div>
            </div>
          ) : (
            <div className={styles.cardContainer}>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>ID do Usuário</span>
                <span className={styles.infoValue}>#{usuario.idUsuario}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Nome</span>
                <span className={styles.infoValue}>{usuario.nome}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>E-mail</span>
                <span className={styles.infoValue}>{usuario.email}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Perfil de Acesso</span>
                <span className={styles.infoValue}>
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor:
                        usuario.role === RoleUsuario.ADMINISTRADOR
                          ? 'rgba(217, 129, 78, 0.15)'
                          : 'rgba(46, 131, 140, 0.15)',
                      color:
                        usuario.role === RoleUsuario.ADMINISTRADOR
                          ? 'var(--color-primary)'
                          : 'var(--color-secondary)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                    }}
                  >
                    {usuario.role}
                  </span>
                </span>
              </div>

              <div className={styles.cardActions}>
                <Link to={`/usuarios/${usuario.idUsuario}/editar`} className={styles.primaryButton}>
                  Editar Usuário
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
