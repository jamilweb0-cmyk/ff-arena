import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import NotFound from "../pages/NotFound/NotFound";

// Public Pages
import Home from "../pages/Home/Home";
import Rooms from "../pages/Rooms/Rooms";
import RoomDetails from "../pages/RoomDetails/RoomDetails";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

// Protected Pages
import AddRoom from "../pages/AddRoom/AddRoom";
import MyRooms from "../pages/MyRooms/MyRooms";
import UpdateRoom from "../pages/UpdateRoom/UpdateRoom";
import MyBookings from "../pages/MyBookings/MyBookings";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      // Public Routes
      { index: true, element: <Home /> },
      { path: "rooms", element: <Rooms /> },
      { path: "rooms/:id", element: <RoomDetails /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      // Protected Routes
      {
        path: "add-room",
        element: (
          <ProtectedRoute>
            <AddRoom />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-rooms",
        element: (
          <ProtectedRoute>
            <MyRooms />
          </ProtectedRoute>
        ),
      },
      {
        path: "update-room/:id",
        element: (
          <ProtectedRoute>
            <UpdateRoom />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-bookings",
        element: (
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        ),
      },
      
      // Catch-all 404
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;