import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import Home from "./routes/Home/Home";
import Login from "./routes/Auth/Login/Login";
import ProtectedLayout from "./layout/ProtectedLayout";
import Register from "./routes/Auth/Register/Register";
import VolunteerHome from "./routes/Volunteer/VolunteerHome";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="volunteer" element={<VolunteerHome />} />
        <Route element={<ProtectedLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default App;
