import apiClient from '../api/client';

/**
 * Service for managing cars
 */
class CarService {
  baseUrl = '/api/cars';

  /**
   * Get all cars
   */
  async getAllCars(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.manager) {
      params.append('manager', filters.manager);
    }
    if (filters.limit) {
      params.append('limit', filters.limit.toString());
    }

    const response = await apiClient.get(
      `${this.baseUrl}${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data;
  }

  /**
   * Get car by ID
   */
  async getCarById(id) {
    const response = await apiClient.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Get cars by manager name
   */
  async getCarsByManager(managerName) {
    const response = await apiClient.get(`${this.baseUrl}/manager/${managerName}`);
    return response.data;
  }

  /**
   * Create a new car
   */
  async createCar(data) {
    const response = await apiClient.post(this.baseUrl, data);
    return response.data;
  }

  /**
   * Update car
   */
  async updateCar(id, data) {
    const response = await apiClient.put(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  /**
   * Delete car
   */
  async deleteCar(id) {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }
}

// Export singleton instance
export const carService = new CarService();
export default carService;
