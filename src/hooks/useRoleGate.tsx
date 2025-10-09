import { useRole } from './useRole';

export const useRoleGate = () => {
  const { role, loading, isAdmin, isOwner, isWorker, isStaff } = useRole();
  
  const shouldUseAdminLayout = isAdmin || isOwner;
  const shouldUseWorkerLayout = isWorker;
  const canAccessAdmin = isAdmin || isOwner;
  
  return {
    role,
    loading,
    isOwner,
    isAdmin,
    isWorker,
    isStaff,
    shouldUseAdminLayout,
    shouldUseWorkerLayout,
    canAccessAdmin
  };
};