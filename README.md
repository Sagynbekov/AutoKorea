# AutoKorea 🚗

A comprehensive car dealership management system built with React and Firebase Firestore, featuring real-time inventory management, staff administration, and financial tracking.


## 🌟 Features

- **Dashboard**: Real-time overview of dealership metrics and performance
- **Car Inventory Management**: Complete CRUD operations for vehicle listings
- **Staff Management**: Employee administration and tracking
- **Financial Calculator**: Advanced pricing and loan calculations
- **Finance Tracking**: Monitor financial performance and transactions
- **Order Management**: Track sales and orders
- **Reports**: Generate detailed business analytics
- **Authentication**: Secure Firebase-based authentication
- **Real-time Database**: Direct Firestore integration for instant data sync
- **Export Functionality**: Export data to PDF and Excel formats

## 🛠️ Tech Stack

- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **HeroUI/NextUI** - Component library
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **Firebase & Firestore** - Authentication and real-time database
- **Lucide React** - Icon library
- **jsPDF** - PDF generation
- **XLSX** - Excel file handling

## 📁 Project Structure

```
AutoKorea/
└── frontend/                 # React application
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── pages/           # Page components
    │   ├── services/        # Firestore service layer
    │   ├── hooks/           # Custom React hooks
    │   ├── context/         # React context providers
    │   ├── api/             # API client configuration
    │   └── config/          # Firebase configuration
    └── public/              # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- Firebase account and project
- npm or yarn package manager

### Installation

#### 1. Clone the Repository

```bash
giFirebase account and project
- npm or yarn package manager

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd AutoKorea
```

#### 2. Install Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

#### 3. Configure Firebase

Update `src/config/firebase.js` with your Firebase configuration

### Running the Application

```bash
# Start the development server
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Download the service account key for the backend
5. Get the web configuration for the frontend

### Environment Variables

Create appropriate configuration files:

**Backend**: `backend/serviceAccountKey.json`
- Add your Firebase Admin SDK credentials

**Frontend**: `frontend/src/config/firebase.js`
- Add your Firebase web app configuration

## 📝 API Documentation

Once the backend is running, access the interactive API documentation:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🎨 Available Pages

- `/` - Dashboard
- `/cars` - Car inventory listing
- `/cars/:id` - Individual car details
- `/staff` - Staff management
- `/calculator` - Financial calculator
- `/finance` - Finance tracking
- `/orders` - Order management
- `/reports` - Business reports
- `/settings` - Application settings
- `/login` - Authentication

## Set up Firestore security rules
5. Get your web app configuration

### Configuration File

Update `frontend/src/config/firebase.js` with your Firebase credentials:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
``
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```


## 👥 Authors

Adilet Sagynbekov

---

**Note**: Make sure to configure your Firebase credentials properly before running the application. Never commit sensitive credentials to version control.
```bash
## 🔒 Security Notes

- Never commit your Firebase configuration with sensitive credentials to version control
- Set up proper Firestore security rules to protect your data
- Use environment variables for sensitive configuration in production
```

The production-ready files will be in the `dist` directory. Deploy to your preferred hosting service (Firebase Hosting, Vercel, Netlify, etc.).
