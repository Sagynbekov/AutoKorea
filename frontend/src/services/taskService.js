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
  orderBy,
  limit as firestoreLimit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Service for managing tasks
 */
class TaskService {
  collectionName = 'tasks';

  /**
   * Get all tasks
   */
  async getAllTasks(filters = {}) {
    const tasksCollection = collection(db, this.collectionName);
    let q = query(tasksCollection, orderBy('createdAt', 'desc'));

    if (filters.status) {
      q = query(tasksCollection, where('status', '==', filters.status), orderBy('createdAt', 'desc'));
    }
    if (filters.priority) {
      q = query(tasksCollection, where('priority', '==', filters.priority), orderBy('createdAt', 'desc'));
    }
    if (filters.assignedTo) {
      q = query(tasksCollection, where('assignedTo', '==', filters.assignedTo), orderBy('createdAt', 'desc'));
    }
    if (filters.limit) {
      q = query(q, firestoreLimit(filters.limit));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Конвертируем Firestore timestamps в ISO strings для совместимости
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      deadline: doc.data().deadline?.toDate?.()?.toISOString() || doc.data().deadline,
      completedAt: doc.data().completedAt?.toDate?.()?.toISOString() || doc.data().completedAt,
    }));
  }

  /**
   * Get task by ID
   */
  async getTaskById(id) {
    const taskDoc = doc(db, this.collectionName, id);
    const taskSnapshot = await getDoc(taskDoc);
    
    if (!taskSnapshot.exists()) {
      throw new Error('Task not found');
    }
    
    const data = taskSnapshot.data();
    return {
      id: taskSnapshot.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      deadline: data.deadline?.toDate?.()?.toISOString() || data.deadline,
      completedAt: data.completedAt?.toDate?.()?.toISOString() || data.completedAt,
    };
  }

  /**
   * Get tasks assigned to specific user
   */
  async getTasksByAssignedTo(userName) {
    const tasksCollection = collection(db, this.collectionName);
    const q = query(
      tasksCollection, 
      where('assignedTo', '==', userName), 
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      deadline: doc.data().deadline?.toDate?.()?.toISOString() || doc.data().deadline,
      completedAt: doc.data().completedAt?.toDate?.()?.toISOString() || doc.data().completedAt,
    }));
  }

  /**
   * Create new task
   */
  async createTask(taskData) {
    const taskToCreate = {
      ...taskData,
      status: 'pending',
      assignedTo: null,
      createdAt: serverTimestamp(),
      deadline: taskData.deadline ? new Date(taskData.deadline) : null,
      completedAt: null,
      completedBy: null,
    };

    const docRef = await addDoc(collection(db, this.collectionName), taskToCreate);
    return docRef.id;
  }

  /**
   * Update task
   */
  async updateTask(id, updates) {
    const taskDoc = doc(db, this.collectionName, id);
    
    const updateData = { ...updates };
    
    // Конвертируем даты в Firestore timestamps если нужно
    if (updateData.deadline) {
      updateData.deadline = new Date(updateData.deadline);
    }
    if (updateData.completedAt) {
      updateData.completedAt = new Date(updateData.completedAt);
    }
    
    await updateDoc(taskDoc, updateData);
  }

  /**
   * Take task (assign to user)
   */
  async takeTask(taskId, userName) {
    const taskDoc = doc(db, this.collectionName, taskId);
    await updateDoc(taskDoc, {
      status: 'in_progress',
      assignedTo: userName
    });
  }

  /**
   * Complete task (mark as pending approval)
   */
  async completeTask(taskId, userName) {
    const taskDoc = doc(db, this.collectionName, taskId);
    await updateDoc(taskDoc, {
      status: 'pending_approval',
      completedAt: serverTimestamp(),
      completedBy: userName
    });
  }

  /**
   * Approve task completion (admin only)
   */
  async approveTask(taskId) {
    const taskDoc = doc(db, this.collectionName, taskId);
    await updateDoc(taskDoc, {
      status: 'completed'
    });
  }

  /**
   * Reject task completion (admin only)
   */
  async rejectTask(taskId, reason) {
    const taskDoc = doc(db, this.collectionName, taskId);
    await updateDoc(taskDoc, {
      status: 'in_progress',
      rejectionReason: reason,
      completedAt: null
    });
  }

  /**
   * Delete task
   */
  async deleteTask(id) {
    const taskDoc = doc(db, this.collectionName, id);
    await deleteDoc(taskDoc);
  }

  /**
   * Get task statistics
   */
  async getTaskStats() {
    const tasks = await this.getAllTasks();
    
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      pendingApproval: tasks.filter(t => t.status === 'pending_approval').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: tasks.filter(t => 
        t.deadline && 
        new Date(t.deadline) < new Date() && 
        t.status !== 'completed'
      ).length,
    };
  }
}

export default new TaskService();