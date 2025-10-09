import { useState, useCallback } from 'react';
import { fetchCustomers } from '@/lib/api/customers';
import type { Customer } from '@/lib/api/customers';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { customers, loading, loadCustomers };
}
