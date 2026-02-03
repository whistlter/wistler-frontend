import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@/routes";
import { MobileRestriction } from "@/components/common/MobileRestriction";

function App() {
  return (
    <BrowserRouter>
      <MobileRestriction />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;