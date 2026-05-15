import { AdminDemoPage } from "./pages/AdminDemoPage";
import { PublicDemoPage } from "./pages/PublicDemoPage";

function App() {
  const path = window.location.pathname;

  if (path === "/admin-demo") {
    return <AdminDemoPage />;
  }

  return <PublicDemoPage />;
}

export default App;
