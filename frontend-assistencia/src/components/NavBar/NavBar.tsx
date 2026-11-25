import { type JSX, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menubar } from 'primereact/menubar';
import type { MenuItem } from 'primereact/menuitem';
import logoImg from "../../assets/logo.svg";
import { authService } from "../../services/authService";
import { getAccessToken, getUserData } from "../../services/apiConfig";
import styles from "./NavBar.module.css";
import { RoleUsuario } from "../../enums/roleUsuario";

function NavBar(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = getAccessToken();
    return !!(token && authService.checkTokenExpiry());
  });

  const [user, setUser] = useState(() => getUserData());

  useEffect(() => {
    const token = getAccessToken();
    const valid = !!(token && authService.checkTokenExpiry());
    setIsAuthenticated(valid);
    if (valid) {
      setUser(getUserData());
    }
  }, [location.pathname]);

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const items: MenuItem[] = [
    {
      label: 'Início',
      icon: 'pi pi-home',
      className: isActive('/') ? styles.activeItem : undefined,
      command: () => navigate('/'),
    },
    {
      label: 'Clientes',
      icon: 'pi pi-users',
      className: isActive('/clientes') ? styles.activeItem : undefined,
      command: () => navigate('/clientes'),
    },
    {
      label: 'Equipamentos',
      icon: 'pi pi-desktop',
      className: isActive('/equipamentos') ? styles.activeItem : undefined,
      command: () => navigate('/equipamentos'),
    },
    {
      label: 'Agendamentos',
      icon: 'pi pi-calendar',
      className: isActive('/agendamento') ? styles.activeItem : undefined,
      command: () => navigate('/agendamento'),
    },
    ...(isAuthenticated && user.role === RoleUsuario.ADMINISTRADOR
      ? [
          {
            label: 'Usuários',
            icon: 'pi pi-shield',
            className: isActive('/usuarios') ? styles.activeItem : undefined,
            command: () => navigate('/usuarios'),
          },
        ]
      : []),
  ];

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const startSection = (
    <div className={styles.logoContainer} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
      <img alt="TechFix Logo" src={logoImg} className={styles.logoImage} />
    </div>
  );

  const endSection = (
    <div className={styles.userSection}>
      {isAuthenticated ? (
        <div className={styles.authenticatedProfile}>
          <div className={styles.avatarCircle}>
            {getInitials(user.nome || user.email)}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user.nome || user.email || 'Colaborador'}</span>
            <span className={styles.userRoleTag}>
              {user.role === RoleUsuario.ADMINISTRADOR ? 'Admin' : 'Técnico'}
            </span>
          </div>
          <button onClick={logout} className={styles.logoutButton} title="Encerrar sessão com segurança">
            <i className="pi pi-sign-out" style={{ fontSize: '0.875rem' }}></i>
            <span>Sair</span>
          </button>
        </div>
      ) : (
        <button onClick={() => navigate('/login')} className={styles.loginLink}>
          <i className="pi pi-lock" style={{ fontSize: '0.85rem' }}></i>
          <span>Entrar no Sistema</span>
        </button>
      )}
    </div>
  );

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerInner}>
        <Menubar
          model={isAuthenticated ? items : [items[0]]}
          start={startSection}
          end={endSection}
          className={styles.customMenubar}
        />
      </div>
    </header>
  );
}

export default NavBar;