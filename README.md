# AutoKorea 🚗

A comprehensive car dealership management system built with React and FastAPI, featuring real-time inventory management, staff administration, and financial tracking.

## 📺 Demo Video

Watch the project demo: [https://youtu.be/tjr4panhi0k](https://youtu.be/tjr4panhi0k)

## 🌟 Features

- **Dashboard**: Real-time overview of dealership metrics and performance
- **Car Inventory Management**: Complete CRUD operations for vehicle listings
- **Staff Management**: Employee administration and tracking
- **Financial Calculator**: Advanced pricing and loan calculations
- **Finance Tracking**: Monitor financial performance and transactions
- **Order Management**: Track sales and orders
- **Reports**: Generate detailed business analytics
- **Authentication**: Secure Firebase-based authentication
- **Export Functionality**: Export data to PDF and Excel formats

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **HeroUI/NextUI** - Component library
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **Firebase** - Authentication and backend services
- **Lucide React** - Icon library
- **jsPDF** - PDF generation
- **XLSX** - Excel file handling

### Backend
- **FastAPI** - High-performance Python web framework
- **Firebase Admin SDK** - Backend authentication and database
- **Pydantic** - Data validation
- **CORS Middleware** - Cross-origin resource sharing

## 📁 Project Structure

```
AutoKorea/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # React context providers
│   │   ├── api/             # API client configuration
│   │   └── config/          # App configuration
│   └── public/              # Static assets
│
└── backend/                  # FastAPI backend application
    ├── app/
    │   ├── config/          # Configuration files
    │   ├── models/          # Data models
    │   ├── routes/          # API endpoints
    │   ├── schemas/         # Pydantic schemas
    │   └── services/        # Business logic
    └── main.py              # Application entry point
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
git clone <repository-url>
cd AutoKorea
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Add your Firebase service account key
# Place serviceAccountKey.json in the backend directory
```

#### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure Firebase
# Update src/config/firebase.js with your Firebase configuration
```

### Running the Application

#### Start Backend Server

```bash
cd backend
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

#### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Configuration

### Firebase Setup

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

## 🔐 Authentication

The application uses Firebase Authentication. Protected routes require user login. Authentication state is managed through React Context.

## 📦 Building for Production

### Frontend

```bash
cd frontend
npm run build
```

The production-ready files will be in the `dist` directory.

### Backend

For production deployment, use a production ASGI server:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

AutoKorea Development Team

---

**Note**: Make sure to configure your Firebase credentials properly before running the application. Never commit sensitive credentials to version control.
