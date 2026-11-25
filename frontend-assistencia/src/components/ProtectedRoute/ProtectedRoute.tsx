import { Navigate } from 'react-router-dom';
import { type ReactElement } from 'react';
import { getAccessToken, getUserData } from '../../services/apiConfig';
import { authService } from '../../services/authService';
import { RoleUsuario } from '../../enums/roleUsuario';

interface ProtectedRouteProps {
  element: ReactElement;
}

export const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const token = getAccessToken();
  const isValid = !!(token && authService.checkTokenExpiry());

  return isValid ? element : <Navigate to="/login" replace />;
};

export const AdminProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const token = getAccessToken();
  const isValid = !!(token && authService.checkTokenExpiry());
  const user = getUserData();
  const isAdmin = user.role === RoleUsuario.ADMINISTRADOR;

  return isValid && isAdmin ? element : <Navigate to="/" replace />;
};
