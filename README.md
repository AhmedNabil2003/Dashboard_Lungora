src/
├── assets/
│   └──
├── components/
│   └── ui/
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── CardContent.jsx
│       ├── Header.jsx
│       ├── Input.jsx
│       ├── Modal.jsx
│       ├── Sidebar.jsx       
├── context/
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx            
│   └── SidebarContext.jsx             
├── features/
│   ├── articles/
│   ├── auth/
│   │   ├── ConfirmPassword.jsx
│   │   ├── ForgetPassword.jsx
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   └── useAuth.js
│   ├── categories/
│   ├── dashboard/
│   │   ├── AnalysisBox.jsx
│   │   ├── DashboardLayout.jsx
│   │   ├── SalesChart.jsx
│   │   ├── Stats.jsx
│   │   └── useDashboard.js
│   ├── doctors/
│   ├── history/
│   ├── settings/
│   └── users/
├── hooks/
│   ├── useLocalStorage.js
│   ├── useMoveBack.js
│   └── useOutsideClick.js
├── pages/
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
├── routes/
│   ├── ProtectedRoute.jsx
│   ├── PublicRoute.jsx
│   └── routes.jsx
├── services/
│   ├── apiArticles.js
│   ├── apiAuth.js
│   ├── apiCategories.js
│   ├── apiDoctors.js
│   ├── apiHistory.js
│   ├── apiModel.js
│   ├── apiSettings.js
│   └── apiUsers.js
│   └── axiosInstance.js
├── App.jsx
├── index.css
├── main.jsx



# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
