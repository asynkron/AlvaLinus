import { readInquiryServiceParam } from "./lib/inquiry-service";
import { SiteHomePage } from "./pages/SiteHomePage";

export function App() {
  return (
    <SiteHomePage
      currentPath={window.location.pathname}
      inquiryServiceId={readInquiryServiceParam(window.location.search)}
    />
  );
}
