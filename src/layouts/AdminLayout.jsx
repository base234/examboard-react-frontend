import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div>
      <header>Admin Navigation</header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
