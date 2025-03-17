// Guest Routes (Accessible by everyone)

import GuestLayout from "@/layouts/GuestLayout";
import Blogs from "@/pages/blogs";
import { Navigate } from "react-router-dom";

const GuestRoutes = [
  // {
  //   path: "/",
  //   element: <GuestLayout />,
  //   children: [{ path: "", element: <Home /> }],
  // },
  {
    path: "/",
    element: <GuestLayout />,
    children: [{ path: "", element: <Navigate to="/login" /> }],
  },
  {
    path: "/blogs",
    element: <GuestLayout />,
    children: [{ path: "", element: <Blogs /> }],
  },
];

export default GuestRoutes;
