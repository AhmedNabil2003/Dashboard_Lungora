import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../features/dashboard/DashboardLayout";

// استيراد الصفحات
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgetPassword from "../pages/ForgetPassword";
import ResetPassword from "../pages/ResetPassword";
import Dashboard from "../pages/Dashboard";
import ManageUsers from "../pages/ManageUsers";
import ManageDoctors from "../pages/ManageDoctors";
import ManageCategories from "../pages/ManageCategories";
import ModelHistoryPage from "../pages/ModelHistoryPage";
import Settings from "../pages/Settings";
import PageNotFound from "../pages/PageNotFound";
import LungoraModel from "../pages/LungoraModel";

const AppRoute = () => (
  <Routes>
    {/* مسارات عامة */}
    <Route path="/" element={<Login />} />
    <Route path="/forget-password" element={<ForgetPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />

    {/* مسارات محمية مع DashboardLayout */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="signup" element={<Register />} />
      <Route path="users" element={<ManageUsers />} />
      <Route path="doctors" element={<ManageDoctors />} />
      <Route path="categories" element={<ManageCategories />} />
      <Route path="history" element={<ModelHistoryPage />} />
      <Route path="lungora-ai" element={<LungoraModel/>} />
      <Route path="settings" element={<Settings />} />
    </Route>

    {/* صفحة الخطأ 404 */}
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default AppRoute;
