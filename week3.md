# Development Report - Week 3

## Weekly Overview: Stabilization and Bug Fixes

After implementing the task management system (Week 2) and the contract generation system (Week 1), the main focus this week was on stabilizing the application, fixing accumulated bugs, and optimizing performance. During operation, several critical and minor issues were identified that required immediate attention.

### Key Tasks for the Week:
1.  **Diagnosing and fixing a critical bug** that caused incorrect display of the car list.
2.  **Resolving an issue with real-time task status updates** for users with the "Staff" role.
3.  **Fixing a problem with contract generation** for cars with specific configurations.
4.  **Reviewing and optimizing Firebase security rules** to enhance data protection.

---

## 1. Problem: "Disappearing" Cars

**Bug Description:**
Users reported that when using filters on the `CarsList.jsx` page, some cars would randomly disappear from the list, even if they matched the filter criteria. The problem was exacerbated on slow internet connections and caused confusion among managers.

**Problem Analysis:**
A deep analysis revealed that the issue was a race condition in the `useCars.js` custom hook. The filtering logic was being applied to the data before it was fully loaded from Firebase, resulting in an incomplete or empty list being displayed.

**Solution:**
1.  **Refactoring the `useCars.js` hook:**
    *   Implemented state separation: one for "raw" data from Firebase (`rawCars`) and another for filtered data (`filteredCars`).
    *   Filtering now only runs after the `isLoading` flag changes to `false`, ensuring that it operates on the complete dataset.
    *   Added a `useEffect` to re-apply filters whenever the raw data changes, ensuring consistency.

2.  **Optimizing `CarsList.jsx`:**
    *   Improved the user interface: a more prominent loading indicator is now displayed during data loading and filtering, blocking re-interaction until the operation is complete.

---

## 2. Problem: Incorrect Task Status Updates

**Bug Description:**
Staff members (role `Staff`) did not see real-time task status updates if an administrator assigned them a task while they were on the `Tasks.jsx` page. They had to manually refresh the page to see new tasks.

**Problem Analysis:**
The issue was related to insufficiently detailed queries to Firestore in `taskService.js`. The query for staff was configured to fetch only tasks they had already accepted, and it did not "listen" for new tasks with a `pending` status.

**Solution:**
1.  **Updating logic in `taskService.js`:**
    *   The Firestore query for staff was expanded. It now tracks not only tasks assigned to them (`assignedTo`) but also all tasks with a `pending` status that are not yet assigned to anyone.
    *   This allowed Firebase to deliver real-time updates when an administrator creates a new task.

2.  **Improving the interface in `Tasks.jsx`:**
    *   Added a visual notification (a small badge) on the "Available Tasks" tab when a new task appears, to draw the staff member's attention.

---

## 3. Problem: Error During Contract Generation

**Bug Description:**
When trying to generate a contract for a car that was missing some optional information in the database (e.g., "additional equipment"), the `ContractGenerator.jsx` component would throw an error, and the modal window would close.

**Problem Analysis:**
The `numberToWords.js` utility and parts of `ContractGenerator.jsx` lacked checks for `null` or `undefined` on optional fields. Attempting to process such a value caused a critical JavaScript error.

**Solution:**
1.  **Added checks in `ContractGenerator.jsx`:**
    *   All data coming from the `car` object now undergoes validation. If a field is empty, a default value (e.g., "not specified") is substituted instead of causing an error.
2.  **Improved the `numberToWords.js` utility:**
    *   Added a check for zero or invalid input values to avoid errors when processing the price.

---

## 4. Task: Firebase Security Optimization

**Description:**
During an audit, it was decided to review and strengthen Firestore security rules to prevent unauthorized data access and ensure stricter control over read and write operations.

**Solution:**
1.  **Completely rewrote Firestore security rules (`firestore.rules`):**
    *   Implemented strict role-based permissions (`admin`/`staff`) derived from the authentication token.
    *   **Write/delete** access for the `cars` and `staff` collections is now restricted to users with the `admin` role.
    *   **Read** access is allowed for all authenticated users, but with field limitations.
    *   Granular rules were configured for the `tasks` collection:
        *   Admins can create/edit/delete any task.
        *   Staff can only change the status of tasks assigned to them (e.g., from `in_progress` to `pending_approval`) and cannot modify other fields.

---

## Weekly Results

### ✅ Resolved Issues:
- [x] Fixed the bug with "disappearing" cars during filtering.
- [x] Restored correct real-time updates for tasks.
- [x] Eliminated the contract generation error for cars with incomplete data.
- [x] Strengthened security and rewrote database access rules.

### 📈 Achieved Improvements:
- **Stability:** The application now operates more predictably and reliably.
- **Security:** Data is protected at the database level, minimizing risks.
- **User Experience (UX):** Improved loading indicators and notifications make the interface more responsive and intuitive.

---
**Developer:** Sagynbekov Adilet