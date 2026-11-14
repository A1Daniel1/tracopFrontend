import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { RoleProvider } from "./RoleProvider";
import { AppRouter } from "./router";

export default function App() {
  useEffect(() => {
    document.title = "TRACOP · Del campo, más cerca";
  }, []);

  return (
    <RoleProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppRouter />
      </BrowserRouter>
    </RoleProvider>
  );
}
