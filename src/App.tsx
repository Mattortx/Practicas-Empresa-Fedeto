import { AdminDemoPage } from "./pages/AdminDemoPage";
import { PracticasPage } from "./pages/PracticasPage";
import { PublicDemoPage } from "./pages/PublicDemoPage";

function App() {
  const path = window.location.pathname;

  if (path === "/admin-demo") {
    return <AdminDemoPage />;
  }

  if (path === "/practicas" || path === "/practicas/tecnica") {
    return <PracticasPage />;
  }

  return <PublicDemoPage />;
}

export default App;
