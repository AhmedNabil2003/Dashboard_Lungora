import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRouteWrapper";
import DashboardLayout from "../features/dashboard/DashboardLayoutWrapper";
import Login from "../pages/Login";
import AddAdmin from "../pages/AddAdminPage";
import Dashboard from "../pages/Dashboard";
import ManageUsers from "../pages/ManageUsersPage";
import ManageDoctors from "../pages/ManageDoctorsPage";
import ManageCategories from "../pages/ManageCategoriesPage";
import ModelHistoryPage from "../pages/ModelHistoryPage";
import Settings from "../pages/Settings";
import PageNotFound from "../pages/PageNotFound";
import LungoraModel from "../pages/LungoraModelPage";
import PublicRoute from "./PublicRoute";
import Profile from "../pages/Profile";

const AppRoute = () => (
  <Routes>
    <Route
      path="/"
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      }
    />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="addadmin" element={<AddAdmin />} />
      <Route path="users" element={<ManageUsers />} />
      <Route path="doctors" element={<ManageDoctors />} />
      <Route path="categories" element={<ManageCategories />} />
      <Route path="history" element={<ModelHistoryPage />} />
      <Route path="lungora-ai" element={<LungoraModel />} />
      <Route path="settings" element={<Settings />} />
    </Route>

    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default AppRoute;
