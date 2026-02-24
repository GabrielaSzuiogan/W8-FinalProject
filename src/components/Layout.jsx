import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./Header/Header";

export default function Layout() {
  const theme = useSelector((state) => state.ui.theme);

  return (
    <div data-theme={theme} className="app-container">
      <Header />
      <main className="main-wrp">
        <Outlet />
      </main>
    </div>
  );
}
