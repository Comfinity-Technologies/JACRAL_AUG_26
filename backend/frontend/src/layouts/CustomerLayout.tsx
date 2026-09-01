import { Outlet } from "react-router-dom";
import Navbar from "../components/customer/Navbar";
import Footer from "../components/customer/Footer";

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-[#FCFAF4] text-[#17382B]">
      <Navbar />

      <main className="min-h-[70vh]">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}