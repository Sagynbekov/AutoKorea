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
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../config/firebase';

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

  /**
   * Convert photo files to base64
   * @param {Array} photos - Array of photo objects with file property
   * @returns {Promise<Array>} - Array of photo base64 data
   */
  async convertPhotosToBase64(photos) {
    const convertPromises = photos.map(async (photo) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          resolve({
            data: e.target.result,
            name: photo.file.name,
            type: photo.file.type,
            size: photo.file.size,
            uploadedAt: new Date().toISOString()
          });
        };
        
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(photo.file);
      });
    });

    return await Promise.all(convertPromises);
  }

  /**
   * Delete car photo from Firebase Storage
   * @param {string} carId - Car ID
   * @param {string} fileName - File name to delete
   */
  async deleteCarPhoto(carId, fileName) {
    const storageRef = ref(storage, `cars/${carId}/${fileName}`);
    await deleteObject(storageRef);
  }

  /**
   * Create car with photos
   * @param {Object} carData - Car data
   * @param {Array} photos - Array of photo objects
   */
  async createCarWithPhotos(carData, photos = []) {
    // Convert photos to base64 if provided
    let photoData = [];
    if (photos.length > 0) {
      photoData = await this.convertPhotosToBase64(photos);
    }

    // Create the car document with photos
    const docRef = await addDoc(collection(db, this.collectionName), {
      ...carData,
      photos: photoData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return {
      id: docRef.id,
      ...carData,
      photos: photoData
    };
  }
}

// Export singleton instance
export const carService = new CarService();
export default carService;
