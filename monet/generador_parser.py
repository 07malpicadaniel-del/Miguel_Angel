import json
import urllib.request
import re
import os

# Configuración de estilos base (Inglés para Stable Diffusion)
# Configuración de estilos base (Minimalista 16-bit para motor 2.5D)

# Configuración de estilos base (Minimalista animado y fondos limpios)

# Configuración de estilos base (Retro 16-bits animado y fondos croma)
ESTILO_BASE = "16-Bit Retro pixel art UI icon, SNES style, simple clean design, pure chroma green background, isolated, no borders"
ESTILO_ISO = "16-Bit Retro isometric pixel art sprite sheet, 4-frame walk cycle animation sequence, SNES style, simple flat colors, pure chroma green background, no borders"
ESTILO_BG = "16-Bit Retro pixel art landscape, SNES style, wide panoramic view"

def parsear_documento(ruta_archivo):
    assets = []
    with open(ruta_archivo, 'r', encoding='utf-8') as f:
        # Limpiamos las líneas vacías
        lineas = [linea.strip() for linea in f.readlines() if linea.strip()]

    for i, linea in enumerate(lineas):
        # Buscar líneas que sean nombres de archivo
        if linea.endswith('.png') or linea.endswith('.jpg'):
            archivo = linea
            # La descripción siempre es la línea inmediatamente inferior en tu documento
            descripcion_cruda = lineas[i+1] if i + 1 < len(lineas) else ""
            
            # --- 1. Calcular Resolución por Prefijo ---
            width, height = 512, 512 # Default (Sprites y Mascotas)
            if archivo.startswith('bg_'):
                width, height = 1024, 512 # Proporción 2:1
            elif archivo.startswith('card_'):
                width, height = 512, 768  # Proporción 2:3
            elif archivo.startswith('item_') or archivo.startswith('block_') or archivo.startswith('structure_') or archivo.startswith('gem_') or archivo.startswith('rune_'):
                width, height = 256, 256  # Proporción 1:1 pequeña
                
            # --- 2. Asignar POV y Estilo Base ---
            prompt_base = ESTILO_BASE
            if archivo.startswith('bg_'):
                prompt_base = ESTILO_BG
            elif "45" in descripcion_cruda or "isométrico" in descripcion_cruda.lower():
                prompt_base = ESTILO_ISO
                
            # --- 3. Limpiar Descripción ---
            # Quitamos los prefijos como "POV 45^\circ." o "Vista frontal." para no confundir a la IA
            desc_limpia = re.sub(r'POV.*?\.\s*|Vista frontal\.\s*', '', descripcion_cruda)
            
            # Construir prompt final (Spanglish funciona bien con DreamShaper, pero el peso lo lleva el estilo base)
            prompt_final = f"{prompt_base}, {desc_limpia}"
            
            assets.append({
                "archivo": archivo,
                "prompt": prompt_final,
                "width": width,
                "height": height
            })
            
    return assets

def queue_prompt(prompt_workflow):
    p = {"prompt": prompt_workflow}
    data = json.dumps(p).encode('utf-8')
    req = urllib.request.Request("http://127.0.0.1:8188/prompt", data=data)
    urllib.request.urlopen(req)

# --- EJECUCIÓN PRINCIPAL ---
if not os.path.exists("workflow_api.json"):
    print("❌ ERROR: No se encontró 'workflow_api.json'. Expórtalo desde ComfyUI.")
    exit()

if not os.path.exists("catalogo.txt"):
    print("❌ ERROR: No se encontró 'catalogo.txt'. Guarda tu documento ahí.")
    exit()

print("Lectura del documento en proceso...")
lista_assets = parsear_documento("catalogo.txt")
print(f"✅ Se encontraron {len(lista_assets)} assets en el documento.")

with open("workflow_api.json", "r", encoding="utf-8") as f:
    plantilla = json.load(f)

# Nodos de ComfyUI (Revisa que coincidan con tu JSON)
NODO_PROMPT = "6"  
NODO_RESOLUCION = "5"
NODO_GUARDAR = "9"

print("🚀 Enviando trabajos a la cola de procesamiento...")
for asset in lista_assets:
    print(f"-> Cola: {asset['archivo']} ({asset['width']}x{asset['height']})")
    
    flujo_actual = json.loads(json.dumps(plantilla))
    flujo_actual[NODO_PROMPT]["inputs"]["text"] = asset["prompt"]
    flujo_actual[NODO_RESOLUCION]["inputs"]["width"] = asset["width"]
    flujo_actual[NODO_RESOLUCION]["inputs"]["height"] = asset["height"]
    flujo_actual[NODO_GUARDAR]["inputs"]["filename_prefix"] = asset["archivo"].split(".")[0]
    
    queue_prompt(flujo_actual)

print("🎉 Todos los prompts fueron extraídos del documento y enviados al servidor.")
