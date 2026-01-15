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
 * Service for managing cars
 */
class CarService {
  collectionName = 'cars';

  /**
   * Get all cars
   */
  async getAllCars(filters = {}) {
    const carsCollection = collection(db, this.collectionName);
    let q = query(carsCollection);

    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters.manager) {
      q = query(q, where('manager', '==', filters.manager));
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
   * Get car by ID
   */
  async getCarById(id) {
    const carDoc = doc(db, this.collectionName, id);
    const carSnapshot = await getDoc(carDoc);
    
    if (!carSnapshot.exists()) {
      throw new Error('Car not found');
    }
    
    return {
      id: carSnapshot.id,
      ...carSnapshot.data()
    };
  }

  /**
   * Get cars by manager name
   */
  async getCarsByManager(managerName) {
    const carsCollection = collection(db, this.collectionName);
    const q = query(carsCollection, where('manager', '==', managerName));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  /**
   * Create a new car
   */
  async createCar(data) {
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
   * Update car
   */
  async updateCar(id, data) {
    const carDoc = doc(db, this.collectionName, id);
    await updateDoc(carDoc, {
      ...data,
      updatedAt: new Date().toISOString()
    });
    
    return {
      id,
      ...data
    };
  }

  /**
   * Delete car
   */
  async deleteCar(id) {
    const carDoc = doc(db, this.collectionName, id);
    await deleteDoc(carDoc);
  }
}

// Export singleton instance
export const carService = new CarService();
export default carService;
