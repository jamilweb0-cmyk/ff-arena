import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home/Home";
import Rooms from "../pages/Rooms/Rooms";
import RoomDetails from "../pages/RoomDetails/RoomDetails";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

import AddRoom from "../pages/AddRoom/AddRoom";
import MyRooms from "../pages/MyRooms/MyRooms";
import UpdateRoom from "../pages/UpdateRoom/UpdateRoom";
import MyBookings from "../pages/MyBookings/MyBookings";

import ErrorPage from "../pages/ErrorPage/ErrorPage";

import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,

    children: [
      // =========================
      // Public Routes
      // =========================

      {
        index: true,
        element: <Home />,
      },

      {
        path: "rooms",
        element: <Rooms />,
      },

      {
        path: "rooms/:id",
        element: <RoomDetails />,
      },

      {
        path: "login",
        element: <Login />,
      },

      {
  path: "*",
  element: <ErrorPage />
},

      {
        path: "register",
        element: <Register />,
      },

      // =========================
      // Protected Routes
      // =========================

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
    ],
  },
]);

export default router;