import { AdminDemoPage } from "./pages/AdminDemoPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { IntegrationPage } from "./pages/IntegrationPage";
import { PracticasPage } from "./pages/PracticasPage";
import { PublicDemoPage } from "./pages/PublicDemoPage";

function App() {
  const path = window.location.pathname;

  if (path === "/admin-demo") {
    return <AdminDemoPage />;
  }

  if (path === "/admin-demo/analytics") {
    return <AnalyticsPage />;
  }

  if (path === "/practicas" || path === "/practicas/tecnica") {
    return <PracticasPage />;
  }

  if (path === "/integracion") {
    return <IntegrationPage />;
  }

  return <PublicDemoPage />;
}

export default App;
