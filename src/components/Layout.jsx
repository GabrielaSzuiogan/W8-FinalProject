import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./Header/Header";
import "../index.css";

export default function Layout() {
  const theme = useSelector((state) => state.ui.theme);

  return (
    <div data-theme={theme} style={{ minHeight: "100vh" }}>
      <Header />
      <main className="main-wrp">
        <Outlet />
      </main>
    </div>
  );
}
