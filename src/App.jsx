import { BrowserRouter } from "react-router-dom";
import AppRoute from "../src/routes/routes";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";

const App = () => (
  
  <BrowserRouter>
  <ThemeProvider>
  <LanguageProvider>
      <AppRoute />
      <Toaster />
      </LanguageProvider>
      </ThemeProvider>
  </BrowserRouter>
);

export default App;
