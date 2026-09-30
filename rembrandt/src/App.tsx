import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { HojaRequisitos } from "./components/HojaRequisitos";
import { MotorRender } from "./components/MotorRender";

function App() {
  const [idea, setIdea] = useState("");
  const [estilo, setEstilo] = useState("16-Bit SNES Pixel Art");
  const [perspectiva, setPerspectiva] = useState("Front-facing, eye level");
  // Actualizamos el valor por defecto para que coincida con tu preferencia monocromática
  const [colores, setColores] = useState("Monochrome, high contrast black and white");
  
  const [promptGenerado, setPromptGenerado] = useState("");
  const [cargando, setCargando] = useState(false);
  const [estadoComfy, setEstadoComfy] = useState("");
  const [estadoProcesador, setEstadoProcesador] = useState("");

  async function invocarAgente() {
    if (!idea) return;
    setCargando(true);
    setEstadoComfy("");
    setEstadoProcesador("");
    try {
      const res: string = await invoke("redactar_prompt_tecnico", { ideaBase: idea, estiloArte: estilo, perspectiva, colores });
      setPromptGenerado(res);
    } catch (e) {
      setPromptGenerado("Error al conectar con Ollama.");
    }
    setCargando(false);
  }

  async function enviarAComfy() {
    setEstadoComfy("Enviando a la GPU...");
    try {
      await invoke("generar_imagen_comfyui", { promptGenerado });
      setEstadoComfy("¡Renderizando! Revisa la terminal.");
    } catch (e) {
      setEstadoComfy(`Error: ${e}`);
    }
  }

// NUEVO: Función dinámica que manda el directorio completo
  async function procesarImagen() {
    setEstadoProcesador("Buscando el asset más reciente y procesando...");
    try {
      // Solo enviamos la carpeta. Rust se encarga de buscar el último PNG.
      const directorio = "/home/daniel/monet/output";
      const res: string = await invoke("procesar_asset", { directorio });
      setEstadoProcesador(res);
    } catch (e) {
      setEstadoProcesador(`Error: ${e}`);
    }
  }

  return (
    <div className="min-h-screen bg-black text-neutral-300 p-8 font-sans selection:bg-neutral-800 selection:text-white">
      <header className="mb-8 border-b border-neutral-800 pb-4">
        <h1 className="text-4xl font-bold text-white tracking-tight uppercase">Rembrandt</h1>
        <p className="text-neutral-500 mt-1 uppercase text-sm tracking-widest">Asset Manager & AI Agent</p>
      </header>
      <main className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <HojaRequisitos idea={idea} setIdea={setIdea} estilo={estilo} setEstilo={setEstilo} perspectiva={perspectiva} setPerspectiva={setPerspectiva} colores={colores} setColores={setColores} cargando={cargando} onGenerar={invocarAgente} />
        <MotorRender prompt={promptGenerado} estadoComfy={estadoComfy} onRenderizar={enviarAComfy} estadoProcesador={estadoProcesador} onProcesar={procesarImagen} />
      </main>
    </div>
  );
}

export default App;
