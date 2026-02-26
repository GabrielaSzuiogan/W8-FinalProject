import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import CatalogPage from "./pages/CatalogPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import BookDetailsPage from "./pages/BookDetailsPage";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminPages/AdminDashboard";
import AdminRoute from "./components/Admin/AdminRoute";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUserLibrary } from "./store/userLibrarySlice";

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserLibrary(user.id));
    }
  }, [user, dispatch]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="catalog/:id" element={<BookDetailsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route
            path="/admin/books"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route path="login" element={<AuthPage />} />
          <Route path="signup" element={<AuthPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
