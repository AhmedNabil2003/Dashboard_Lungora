import { Outlet } from "react-router-dom";
import Sidebar from "../../components/ui/Sidebar";
import Header from "../../components/ui/Header";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen">
      {/* الشريط الجانبي */}
      <Sidebar />

      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col bg-gray-100">
        <Header />
        <main className="p-2 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
