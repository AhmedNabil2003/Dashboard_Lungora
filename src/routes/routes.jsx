import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../features/dashboard/DashboardLayout";

// استيراد الصفحات
import Login from "../pages/Login";
import AddAdmin from "../pages/AddAdmin";
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
import PublicRoute from "./PublicRoute";
import Profile from "../pages/Profile";

const AppRoute = () => (
  <Routes>
    {/* مسارات عامة */}
    <Route path="/" element={
       <PublicRoute>
      <Login />
       </PublicRoute>
      } />
    <Route path="/forget-password" element={
       <PublicRoute>
      <ForgetPassword />
       </PublicRoute>
      } />
    <Route path="/reset-password" element={
       <PublicRoute>
         <ResetPassword />
       </PublicRoute>
      } />

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
      <Route path="profile" element={<Profile/>} />
      <Route path="addadmin" element={<AddAdmin/>} />
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
