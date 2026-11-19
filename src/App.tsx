import { BrowserRouter as Router, Routes, Route } from "react-router";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Services from "./pages/Services";
import Chambres from "./pages/Chambres";
import Lits from "./pages/Lits";
import Sejours from "./pages/Sejours";
import EtatChambres from "./pages/EtatChambres";
import Personnel from "./pages/Personnel";
import Protocoles from "./pages/Protocoles";
import Produits from "./pages/Produits";
import Historique from "./pages/Historique";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            {/* Home Route */}
            <Route index path="/" element={<EtatChambres />} />

            {/* Bionettoyage - INFRASTRUCTURE */}
            <Route path="/services" element={<Services />} />
            <Route path="/chambres" element={<Chambres />} />
            <Route path="/lits" element={<Lits />} />

            {/* Bionettoyage - HOSPITALISATION */}
            <Route path="/sejours" element={<Sejours />} />
            <Route path="/etat-chambres" element={<EtatChambres />} />

            {/* Bionettoyage - OPÉRATIONS */}
            <Route path="/personnel" element={<Personnel />} />
            <Route path="/protocoles" element={<Protocoles />} />
            <Route path="/produits" element={<Produits />} />
            <Route path="/historique" element={<Historique />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}