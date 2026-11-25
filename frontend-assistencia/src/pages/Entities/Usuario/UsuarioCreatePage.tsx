import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../../../components/NavBar/NavBar';
import Footer from '../../../components/Footer/Footer';
import { DynamicForm, type FieldConfig } from '../../../components/DynamicForm/DynamicForm';
import { ApiError } from '../../../services/apiClient';
import { usuarioService } from '../../../services/usuarioService';
import { roleUsuarioOptions, usuarioCreateSchema, type UsuarioCreateFormData } from '../../../schemas/usuarioSchema';
import { RoleUsuario } from '../../../enums/roleUsuario';
import styles from '../Create.module.css';

export function UsuarioCreatePage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const createFields: FieldConfig<UsuarioCreateFormData>[] = [
    { name: 'nome', label: 'Nome Completo', required: true, maxLength: 100, placeholder: 'Ex: Carlos Souza' },
    { name: 'email', label: 'E-mail Institucional', type: 'email', required: true, placeholder: 'usuario@email.com' },
    { name: 'senha', label: 'Senha (mínimo 8 caracteres)', type: 'password', required: true, minLength: 8 },
    {
      name: 'role',
      label: 'Perfil de Acesso',
      required: true,
      options: roleUsuarioOptions,
    },
  ];

  const handleCreate = async (data: UsuarioCreateFormData) => {
    setError('');
    try {
      const created = await usuarioService.cadastrar(data);
      navigate(`/usuarios/${created.idUsuario}`);
    } catch (requestError: unknown) {
      setError(
        requestError instanceof ApiError ? requestError.message : 'Não foi possível cadastrar o usuário.'
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
          <h1 className={styles.headerTitle}>Novo Usuário</h1>
          <p className={styles.headerSubtitle}>
            Cadastre credenciais para administradores ou funcionários técnicos com hash criptográfico de senha.
          </p>
        </div>

        {error && <p className={styles.errorMessage} role="alert">{error}</p>}

        <DynamicForm
          schema={usuarioCreateSchema}
          fields={createFields}
          defaultValues={{
            role: RoleUsuario.FUNCIONARIO,
          }}
          onSubmit={handleCreate}
          submitText="Salvar Usuário"
        />
      </main>
      <Footer />
    </div>
  );
}
