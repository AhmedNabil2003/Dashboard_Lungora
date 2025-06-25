import { BrowserRouter } from "react-router-dom";
import AppRoute from "../src/routes/routes";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeProviderContext";
import { DashboardProvider } from "./context/DashboardContext";

const App = () => (
  <DashboardProvider>
    <BrowserRouter>
      <ThemeProvider>
        <AppRoute />
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  </DashboardProvider>
);

export default App;
