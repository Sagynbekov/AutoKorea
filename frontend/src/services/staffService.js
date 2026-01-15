import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  limit as firestoreLimit
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Service for managing staff members
 */
class StaffService {
  collectionName = 'staff';

  /**
   * Get all staff members
   */
  async getAllStaff(filters = {}) {
    const staffCollection = collection(db, this.collectionName);
    let q = query(staffCollection);

    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters.limit) {
      q = query(q, firestoreLimit(filters.limit));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  /**
   * Get staff member by ID
   */
  async getStaffById(id) {
    const staffDoc = doc(db, this.collectionName, id);
    const staffSnapshot = await getDoc(staffDoc);
    
    if (!staffSnapshot.exists()) {
      throw new Error('Staff member not found');
    }
    
    return {
      id: staffSnapshot.id,
      ...staffSnapshot.data()
    };
  }

  /**
   * Search staff members
   */
  async searchStaff(searchQuery) {
    const staffCollection = collection(db, this.collectionName);
    const querySnapshot = await getDocs(staffCollection);
    
    const allStaff = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Клиентский поиск по имени и email
    const searchLower = searchQuery.toLowerCase();
    return allStaff.filter(staff => 
      staff.name?.toLowerCase().includes(searchLower) ||
      staff.email?.toLowerCase().includes(searchLower)
    );
  }

  /**
   * Create a new staff member
   */
  async createStaff(data) {
    const docRef = await addDoc(collection(db, this.collectionName), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return {
      id: docRef.id,
      ...data
    };
  }

  /**
   * Update staff member
   */
  async updateStaff(id, data) {
    const staffDoc = doc(db, this.collectionName, id);
    await updateDoc(staffDoc, {
      ...data,
      updatedAt: new Date().toISOString()
    });
    
    return {
      id,
      ...data
    };
  }

  /**
   * Delete staff member
   */
  async deleteStaff(id) {
    const staffDoc = doc(db, this.collectionName, id);
    await deleteDoc(staffDoc);
  }
}

// Export singleton instance
export const staffService = new StaffService();
export default staffService;
