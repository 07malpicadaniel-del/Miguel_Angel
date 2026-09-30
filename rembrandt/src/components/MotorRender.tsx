interface Props {
  prompt: string;
  estadoComfy: string;
  onRenderizar: () => void;
  estadoProcesador: string;
  onProcesar: () => void;
}

export function MotorRender({ prompt, estadoComfy, onRenderizar, estadoProcesador, onProcesar }: Props) {
  return (
    <section className="bg-neutral-900/40 p-6 rounded-xl border border-neutral-800 shadow-2xl flex flex-col h-full">
      <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-2 border-b border-neutral-800 pb-2">
        Prompt Optimizado
      </h2>

      <div className="bg-black border border-neutral-800 rounded-lg p-4 text-neutral-400 font-mono text-sm leading-relaxed flex-grow min-h-[140px] whitespace-pre-wrap">
        {prompt || "Esperando instrucciones..."}
      </div>

      {prompt && (
        <div className="mt-6 flex flex-col gap-4">
          <div>
            <button
              onClick={onRenderizar}
              className="w-full bg-white text-black hover:bg-neutral-200 font-bold py-3 rounded-lg transition-colors uppercase tracking-widest text-sm"
            >
              Renderizar en GPU
            </button>
            {estadoComfy && (
              <p className="mt-2 text-center text-xs font-mono text-neutral-500 uppercase tracking-widest">
                {estadoComfy}
              </p>
            )}
          </div>

          <hr className="border-neutral-800" />

          <div>
            <button
              onClick={onProcesar}
              className="w-full bg-transparent border border-white text-white hover:bg-white hover:text-black font-bold py-3 rounded-lg transition-colors uppercase tracking-widest text-sm"
            >
              Recortar Bounding Box (Alfa)
            </button>
            {estadoProcesador && (
              <p className="mt-2 text-center text-xs font-mono text-neutral-400 uppercase tracking-wide">
                {estadoProcesador}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
