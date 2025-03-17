import GuestRoutes from "./routes/guest.Routes";
import AuthRoutes from "./routes/auth.Routes";
import TeacherRoutes from "./routes/teacher.Routes";
import WriterRoutes from "./routes/writer.Routes";
import AdminRoutes from "./routes/admin.Routes";

import Error404 from "./pages/Error404";

const routes = [
  // Guest Routes (Accessible by everyone/public)
  ...GuestRoutes,

  // Auth Routes (Accessible only if not logged in)
  ...AuthRoutes,

  // Customer Routes (Accessible only if role is "user")
  ...TeacherRoutes,

  // Writer Routes (Accessible only if role is "user")
  ...WriterRoutes,

  // Admin Routes (Accessible only if role is "admin")
  ...AdminRoutes,
  {
    path: "*",
    children: [{ path: "*", element: <Error404 /> }],
  },
];

export default routes;
