import { useState, useEffect } from 'react';
import { taskService } from '../services';

/**
 * Custom hook for fetching tasks data
 */
export function useTasks(filters = {}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getAllTasks(filters);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch tasks'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters?.status, filters?.priority, filters?.assignedTo, filters?.limit]);

  return { tasks, loading, error, refetch: fetchTasks };
}

/**
 * Custom hook for task operations
 */
export function useTaskOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTask = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await taskService.createTask(data);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create task');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      await taskService.updateTask(id, updates);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update task');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const takeTask = async (taskId, userName) => {
    try {
      setLoading(true);
      setError(null);
      await taskService.takeTask(taskId, userName);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to take task');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId, userName) => {
    try {
      setLoading(true);
      setError(null);
      await taskService.completeTask(taskId, userName);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to complete task');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const approveTask = async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      await taskService.approveTask(taskId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to approve task');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const rejectTask = async (taskId, reason) => {
    try {
      setLoading(true);
      setError(null);
      await taskService.rejectTask(taskId, reason);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to reject task');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await taskService.deleteTask(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete task');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createTask,
    updateTask,
    takeTask,
    completeTask,
    approveTask,
    rejectTask,
    deleteTask,
    loading,
    error
  };
}

/**
 * Custom hook for task statistics
 */
export function useTaskStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getTaskStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch task stats'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
}