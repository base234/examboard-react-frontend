import { useRoutes } from "react-router-dom";
import routes from "@/router";

const AppRouter = () => {
  const routing = useRoutes(routes);
  return routing;
};

export default AppRouter;
