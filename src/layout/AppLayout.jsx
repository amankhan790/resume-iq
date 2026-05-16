import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="min-h-screen gradient">
      <Header />
      <main className="min-h-screen px-10 lg:px-20">
        <div className="gradient"></div>
        <Outlet />
      </main>
      <div className="text-center py-4">
        &copy; {new Date().getFullYear()} ResumeIq. All rights reserved.
      </div>
    </div>
  );
};

export default AppLayout;
