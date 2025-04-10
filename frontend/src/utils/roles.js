export const isAdmin = (role) => role === 'ADMIN';
export const isMember = (role) => role === 'MEMBER';
export const hasRole = (userRole, requiredRole) => userRole === requiredRole;

export const ROLES = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER'
};
