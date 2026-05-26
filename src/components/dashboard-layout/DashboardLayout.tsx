import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Siderbar";

const DashboardLayout = () => {
  return (
    <div className="flex bg-[#0d0d15] min-h-screen text-white overflow-x-hidden font-[Poppins]">
      <Sidebar />

      <main className="flex-1 pl-[80px] md:pl-[90px] pt-20 min-h-screen flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
