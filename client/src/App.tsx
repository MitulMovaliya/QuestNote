import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PATHS } from "./config/paths";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "oklch(0.15 0.01 264.376)",
            color: "oklch(0.985 0.003 264.376)",
            border: "1px solid oklch(0.25 0.02 264.376)",
            borderRadius: "0.5rem",
            fontSize: "14px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
          },
          success: {
            iconTheme: {
              primary: "oklch(0.6 0.22 264.376)",
              secondary: "oklch(0.985 0.003 264.376)",
            },
            style: {
              border: "1px solid oklch(0.6 0.22 264.376)",
            },
          },
          error: {
            iconTheme: {
              primary: "oklch(0.6 0.24 25)",
              secondary: "oklch(0.985 0.003 264.376)",
            },
            style: {
              border: "1px solid oklch(0.6 0.24 25)",
            },
          },
          loading: {
            iconTheme: {
              primary: "oklch(0.6 0.22 264.376)",
              secondary: "oklch(0.985 0.003 264.376)",
            },
          },
        }}
      />
      <Routes>
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route path={PATHS.REGISTER} element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
