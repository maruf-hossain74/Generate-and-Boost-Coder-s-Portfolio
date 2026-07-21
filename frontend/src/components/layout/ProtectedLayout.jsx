import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function ProtectedLayout() {
  return (
    <div className="min-h-screen bg-app-bg flex">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
