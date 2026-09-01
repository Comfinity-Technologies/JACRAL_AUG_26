import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { customerRoutes } from "./routes/customerRoutes";
import { adminRoutes } from "./routes/adminRoutes";

const router = createBrowserRouter([
  ...customerRoutes,
  ...adminRoutes,
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;