import MainCard from "../components/MainCard/MainCard";
import { Book } from "lucide-react";
import "./pages.css";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <MainCard
        icon={<Book size={48} color="var(--btn-primary)" />}
        title={
          <>
            Welcome to the
            <br />
            Starwood Sprite Library
          </>
        }
        description="The quietest place in the enchanted forest. Here, you can browse ancient tomes and track your progress."
        buttonText="Browse the Tomes"
        linkTo="/catalog"
      />
    </div>
  );
}
