import { SiteHomePage } from "./pages/SiteHomePage";
import { siteContent } from "./data/siteContent";

export function App() {
  return <SiteHomePage currentPath={window.location.pathname} initialState={{ status: "ready", content: siteContent }} />;
}
