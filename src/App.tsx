import { SiteHomePage } from "./pages/SiteHomePage";

export function App() {
  return <SiteHomePage currentPath={window.location.pathname} />;
}
