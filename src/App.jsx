import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import CatalogPage from "./pages/CatalogPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import BookDetailsPage from "./pages/BookDetailsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="catalog/:id" element={<BookDetailsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
