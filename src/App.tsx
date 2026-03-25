import { useEffect } from "react";
import "../styles/main.css";
import RouteManager from "./routes/routes";
import { mountBackgroundMusic } from "./pages/BackgroundMusic";

export default function App() {
  useEffect(() => {
    const cleanup = mountBackgroundMusic();
    return cleanup; // se llama al desmontar
  }, []); // [] = solo una vez al montar

  return (
    <>
      <RouteManager />
    </>
  );
}