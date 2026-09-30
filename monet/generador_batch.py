import json
import urllib.request
import urllib.parse

# 1. Tu Catálogo Maestro (Muestra de las 4 categorías)
catalogo = [
    # Sección A: Sprites de Personajes
    {"archivo": "hero_grim_reaper.png", "prompt": "Dark Synthwave isometric pixel art of the Grim Reaper, wearing a black gothic robe with glowing neon green eyes and holding a scythe, Spectral Gothic Neon style, cyan and purple aether accents, 45 degree top-down angle, solid black background.", "width": 512, "height": 512},
    
    # Sección C: Armas y Bloques
    {"archivo": "item_scythe_spectral.png", "prompt": "Dark Synthwave pixel art of a curved spectral scythe blade shining with a cyan flash, Spectral Gothic Neon style, spectral cyan accents, frontal flat view centered, solid black background.", "width": 256, "height": 256},
    
    # Sección E: Cartas Rogue-Lite
    {"archivo": "card_vampiric_harvest.png", "prompt": "Dark Synthwave pixel art of a scythe absorbing red life spheres, Spectral Gothic Neon style, blood red accents, frontal flat portrait view centered, glowing neon border, solid black background.", "width": 512, "height": 768},
    
    # Sección 4: Biomas
    {"archivo": "bg_biome_prairie.jpg", "prompt": "Dark Synthwave pixel art of green prairie meadows with oak trees and flowers under a starry sky, Spectral Gothic Neon style, wide panoramic view, horizon landscape, highly detailed background.", "width": 1024, "height": 512}
    
    # NOTA: Aquí puedes pegar el resto de los prompts que generamos anteriormente siguiendo este mismo formato.
]

def queue_prompt(prompt_workflow):
    p = {"prompt": prompt_workflow}
    data = json.dumps(p).encode('utf-8')
    req =  urllib.request.Request("http://127.0.0.1:8188/prompt", data=data)
    urllib.request.urlopen(req)

# 2. Cargar la plantilla base exportada de ComfyUI
with open("workflow_api.json", "r", encoding="utf-8") as f:
    plantilla = json.load(f)

# 3. Identificar los IDs de los Nodos (Ajusta estos números según tu JSON exportado)
# Usualmente: 6 es el Prompt Positivo, 5 es el Empty Latent Image (Resolución), 9 es Save Image.
NODO_PROMPT = "6"  
NODO_RESOLUCION = "5"
NODO_GUARDAR = "9"

print(f"🚀 Iniciando generación en lote de {len(catalogo)} assets...")

# 4. Bucle de ejecución
for asset in catalogo:
    print(f"Generando: {asset['archivo']}...")
    
    # Clonamos la plantilla para no sobreescribir la original
    flujo_actual = json.loads(json.dumps(plantilla))
    
    # Inyectamos los datos del catálogo en los nodos
    flujo_actual[NODO_PROMPT]["inputs"]["text"] = asset["prompt"]
    flujo_actual[NODO_RESOLUCION]["inputs"]["width"] = asset["width"]
    flujo_actual[NODO_RESOLUCION]["inputs"]["height"] = asset["height"]
    flujo_actual[NODO_GUARDAR]["inputs"]["filename_prefix"] = asset["archivo"].split(".")[0] # Sin extensión
    
    # Enviar a la cola de ComfyUI
    queue_prompt(flujo_actual)

print("✅ Todos los assets han sido enviados a la cola de ComfyUI.")
