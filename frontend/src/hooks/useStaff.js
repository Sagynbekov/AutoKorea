import { useState, useEffect } from 'react';
import { staffService } from '../services';

/**
 * Custom hook for fetching staff data
 */
export function useStaff(filters = {}) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await staffService.getAllStaff(filters);
      setStaff(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch staff'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [filters?.status, filters?.limit]);

  return { staff, loading, error, refetch: fetchStaff };
}

/**
 * Custom hook for staff operations
 */
export function useStaffOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createStaff = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await staffService.createStaff(data);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create staff');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateStaff = async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await staffService.updateStaff(id, data);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update staff');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteStaff = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await staffService.deleteStaff(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete staff');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { createStaff, updateStaff, deleteStaff, loading, error };
}
