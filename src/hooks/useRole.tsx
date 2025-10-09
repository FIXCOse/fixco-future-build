import { useAuthProfile } from './useAuthProfile';

export type UserRole = 'owner' | 'admin' | 'manager' | 'worker' | 'technician' | 'finance' | 'support' | 'customer';

export function useRole() {
  const { profile, loading } = useAuthProfile();
  
  const role = (profile?.role as UserRole) || 'customer';
  
  const isAdmin = role === 'admin' || role === 'owner';
  const isOwner = role === 'owner';
  const isWorker = role === 'worker';
  const isStaff = ['owner', 'admin', 'manager', 'technician', 'finance', 'support'].includes(role);
  
  return {
    role,
    loading,
    isAdmin,
    isOwner,
    isWorker,
    isStaff,
    isCustomer: role === 'customer'
  };
}