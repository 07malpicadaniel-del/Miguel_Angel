interface Props {
  idea: string;
  setIdea: (val: string) => void;
  estilo: string;
  setEstilo: (val: string) => void;
  perspectiva: string;
  setPerspectiva: (val: string) => void;
  colores: string;
  setColores: (val: string) => void;
  cargando: boolean;
  onGenerar: () => void;
}

export function HojaRequisitos({ idea, setIdea, estilo, setEstilo, perspectiva, setPerspectiva, colores, setColores, cargando, onGenerar }: Props) {
  return (
    <section className="bg-neutral-900/40 p-6 rounded-xl border border-neutral-800 shadow-2xl flex flex-col gap-4">
      <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-2 border-b border-neutral-800 pb-2">
        Hoja de Requisitos
      </h2>
      
      <div>
        <label className="block text-xs font-semibold mb-1 text-neutral-500 uppercase tracking-wide">Idea Central</label>
        <input
          type="text"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Ej. Esqueleto malvado..."
          className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-white transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1 text-neutral-500 uppercase tracking-wide">Estilo</label>
          <select value={estilo} onChange={(e) => setEstilo(e.target.value)} className="w-full bg-black border border-neutral-800 rounded-lg p-2 text-sm text-neutral-300 focus:outline-none focus:border-white">
            <option value="16-Bit SNES Pixel Art">16-Bit Pixel Art</option>
            <option value="1930s Rubber-hose cartoon, vintage animation">1930s Rubber-Hose</option>
            <option value="Dark Fantasy Concept Art, highly detailed">Dark Fantasy Concept</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 text-neutral-500 uppercase tracking-wide">Perspectiva</label>
          <select value={perspectiva} onChange={(e) => setPerspectiva(e.target.value)} className="w-full bg-black border border-neutral-800 rounded-lg p-2 text-sm text-neutral-300 focus:outline-none focus:border-white">
            <option value="Front-facing, eye level">Frontal (Retrato)</option>
            <option value="Top-down 2D RPG perspective">Top-Down (RPG)</option>
            <option value="Side-scroller profile view">Lateral (Plataformas)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1 text-neutral-500 uppercase tracking-wide">Colores</label>
        <input
          type="text"
          value={colores}
          onChange={(e) => setColores(e.target.value)}
          className="w-full bg-black border border-neutral-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-white transition-colors"
        />
      </div>

      <button
        onClick={onGenerar}
        disabled={cargando || !idea}
        className="mt-4 bg-white hover:bg-neutral-200 disabled:bg-neutral-900 disabled:text-neutral-600 disabled:border disabled:border-neutral-800 text-black font-bold py-3 rounded-lg transition-colors uppercase tracking-widest text-sm"
      >
        {cargando ? "Procesando..." : "Generar Blueprint"}
      </button>
    </section>
  );
}
