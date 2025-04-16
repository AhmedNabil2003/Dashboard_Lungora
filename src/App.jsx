import { BrowserRouter } from "react-router-dom";
import AppRoute from "../src/routes/routes";
import { Toaster } from "react-hot-toast";

const App = () => (
  <BrowserRouter>
      <AppRoute />
      <Toaster />
  </BrowserRouter>
);

export default App;
