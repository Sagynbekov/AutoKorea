import apiClient from '../api/client';

/**
 * Service for managing staff members
 */
class StaffService {
  baseUrl = '/api/staff';

  /**
   * Get all staff members
   */
  async getAllStaff(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.status) {
      params.append('status', filters.status);
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
   * Get staff member by ID
   */
  async getStaffById(id) {
    const response = await apiClient.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Search staff members
   */
  async searchStaff(query) {
    const response = await apiClient.get(`${this.baseUrl}/search`, {
      params: { q: query },
    });
    return response.data;
  }

  /**
   * Create a new staff member
   */
  async createStaff(data) {
    const response = await apiClient.post(this.baseUrl, data);
    return response.data;
  }

  /**
   * Update staff member
   */
  async updateStaff(id, data) {
    const response = await apiClient.put(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  /**
   * Delete staff member
   */
  async deleteStaff(id) {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }
}

// Export singleton instance
export const staffService = new StaffService();
export default staffService;
