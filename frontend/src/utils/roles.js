export const ROLES = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
};

export const hasRole = (user, role) => {
  return user?.role === role;
};

export const isAdmin = (user) => {
  return hasRole(user, ROLES.ADMIN);
};
