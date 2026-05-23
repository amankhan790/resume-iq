import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import "./index.css";
import Resume from "./pages/Resume";
import LandingPage from "./pages/LandingPage";
import Upload from "./pages/Upload";
import TaskList from "./components/TaskList";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/upload",
        element: <Upload />,
      },
      {
        path: "/resume/:id",
        element: <Resume />,
      },
      {
        path: "/tasks",
        element: <TaskList />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
