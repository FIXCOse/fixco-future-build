import { useAuthProfile } from './useAuthProfile';

export type UserRole = 'owner' | 'admin' | 'manager' | 'technician' | 'finance' | 'support' | 'customer';

export function useRole() {
  const { profile, loading } = useAuthProfile();
  
  const role = (profile?.role as UserRole) || 'customer';
  
  const isAdmin = role === 'admin' || role === 'owner';
  const isOwner = role === 'owner';
  const isStaff = ['owner', 'admin', 'manager', 'technician', 'finance', 'support'].includes(role);
  
  return {
    role,
    loading,
    isAdmin,
    isOwner, 
    isStaff,
    isCustomer: role === 'customer'
  };
}