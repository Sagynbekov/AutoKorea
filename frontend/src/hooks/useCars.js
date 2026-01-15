import { useState, useEffect } from 'react';
import { carService } from '../services';

/**
 * Custom hook for fetching cars data
 */
export function useCars(filters = {}) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await carService.getAllCars(filters);
      setCars(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch cars'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [filters?.status, filters?.manager, filters?.limit]);

  return { cars, loading, error, refetch: fetchCars };
}

/**
 * Custom hook for car operations
 */
export function useCarOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCar = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await carService.createCar(data);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create car');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCar = async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await carService.updateCar(id, data);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update car');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await carService.deleteCar(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete car');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { createCar, updateCar, deleteCar, loading, error };
}
