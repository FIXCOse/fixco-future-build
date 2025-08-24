import { useRole } from './useRole';

export const useRoleGate = () => {
  const { role, loading, isAdmin, isOwner, isStaff } = useRole();
  
  const shouldUseAdminLayout = isAdmin || isOwner;
  const canAccessAdmin = isAdmin || isOwner;
  
  return {
    role,
    loading,
    isOwner,
    isAdmin,
    isStaff,
    shouldUseAdminLayout,
    canAccessAdmin
  };
};