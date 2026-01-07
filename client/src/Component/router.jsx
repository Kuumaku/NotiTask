import { createBrowserRouter } from "react-router-dom";
import App from "../App"; // Your main app component
import EditTodo from "./EditTodo";
import MainPage from "./MainPage";
import SignIn from "./SignIn";
import TeamMember from "./TeamMember"; // Make sure to import TeamMember component

const router = createBrowserRouter(
  [
    { path: "/", element: <App /> },
    { path: "/edit/:id", element: <EditTodo /> },
    { path: "/Todo/:userId", element: <MainPage /> },
    { path: "/signIn", element: <SignIn /> },
    { path: "/team/:userId", element: <TeamMember /> }, // Added TeamMember route
  ],
  {
    future: {
      v7_relativeSplatPath: true, // ✅ Opt into v7 behavior
    },
  }
);

export default router;