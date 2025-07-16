# Lungora Web Dashboard 🌐

**Lungora Web** is the frontend dashboard for the Lungora AI-powered chest disease diagnosis system. Built using **React + Vite**, it follows a modular architecture with a clean and maintainable codebase.

---

## 🔗 Project Links

- 🔍 **Live API Swagger Docs**: [https://lungora.runasp.net/swagger/index.html](https://lungora.runasp.net/swagger/index.html)  
- 📱 **Mobile App Repo**: [GitHub - Mobile](https://github.com/omarAbdullahMoharam/Lungora)  
- 🖥️ **Web Dashboard Repo**: [GitHub - Dashboard](https://github.com/AhmedNabil2003/Dashboard_Lungora)

---

## 📦 Project Structure
```text
src/
├── assets/                 # Static files (images, icons, etc.)
│
├── components/             # Reusable UI components
│   └── ui/                 # Button, Card, Header, Modal, Sidebar, etc.
│
├── context/                # React Context API providers
│   ├── AuthContext.jsx     # Handles authentication state
│   ├── ThemeContext.jsx    # Manages theme (light/dark)
│   └── SidebarContext.jsx  # Controls sidebar toggle state
│
├── features/               # Modular feature-based components
│   ├── articles/           # Manage articles
│   ├── auth/               # Login, Register, Forget/Reset Password
│   │   ├── ConfirmPassword.jsx
│   │   ├── ForgetPassword.jsx
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   └── useAuth.js
│   ├── categories/         # Manage categories
│   ├── dashboard/          # Dashboard UI components and logic
│   │   ├── AnalysisBox.jsx
│   │   ├── DashboardLayout.jsx
│   │   ├── SalesChart.jsx
│   │   ├── Stats.jsx
│   │   └── useDashboard.js
│   ├── doctors/            # Manage doctors
│   ├── history/            # Model prediction history
│   ├── settings/           # Profile/settings configuration
│   └── users/              # User management
│
├── hooks/                  # Custom reusable hooks
│   ├── useLocalStorage.js
│   ├── useMoveBack.js
│   └── useOutsideClick.js
│
├── pages/                  # Page-level route components
│   ├── Dashboard.jsx
│   ├── ForgetPassword.jsx
│   ├── Login.jsx
│   ├── LungoraModel.jsx
│   ├── ManageCategories.jsx
│   ├── ManageDoctors.jsx
│   ├── ManageUsers.jsx
│   ├── ModelHistoryPage.jsx
│   ├── PageNotFound.jsx
│   ├── Profile.jsx
│   ├── Register.jsx
│   └── Settings.jsx
│
├── routes/                 # Route configuration and protection
│   ├── ProtectedRoute.jsx
│   ├── PublicRoute.jsx
│   └── routes.jsx
│
├── services/               # API service layer (Axios-based)
│   ├── apiArticles.js
│   ├── apiAuth.js
│   ├── apiCategories.js
│   ├── apiDoctors.js
│   ├── apiHistory.js
│   ├── apiModel.js
│   ├── apiSettings.js
│   ├── apiUsers.js
│   └── axiosInstance.js
│
├── App.jsx                 # Root application component
├── main.jsx                # Vite entry point
└── index.css               # Global styles


---


## 🚀 Features

- 🔐 Authentication (Login, Register, Forget Password)
- 📊 Admin Dashboard with real-time statistics and charts
- 🧠 Lungora AI Integration for chest diagnosis
- 📁 History of model scans and analysis
- 👨‍⚕️ Doctor and user management
- 🧩 Article & Category modules
- ⚙️ Settings and theme customization
- 🧠 Context API for global state (auth, sidebar, theme)
- 🌍 Responsive and modern UI

---

## 🛠️ Tech Stack

| Layer       | Technology                      |
|------------|----------------------------------|
| Frontend    | React + Vite                    |
| Styling     | Tailwind CSS / Custom CSS       |
| Routing     | React Router DOM                |
| State Mgmt  | React Context API               |
| HTTP Client | Axios (via `axiosInstance.js`)  |
| Charts      | Recharts / Chart.js             |
| Hooks       | Custom hooks (`useOutsideClick`, etc.) |

---

## 📥 Installation

```bash
# 1. Clone the repository
git clone https://github.com/YourUsername/Dashboard_Lungora.git
cd Dashboard_Lungora

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
