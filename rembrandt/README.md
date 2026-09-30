# 🎨 Rembrandt - AI Art Agent & Asset Manager

Rembrandt es una herramienta de escritorio y agente autónomo construida con Tauri, Rust y React. Utiliza el Model Context Protocol (MCP) para orquestar un LLM local que actúa como Director de Arte, generando, gestionando y procesando assets gráficos a través de la API de ComfyUI.

## ✨ Arquitectura del Sistema
*   **Interfaz de Usuario:** React 19 + TypeScript + Tailwind CSS v4 para monitorización y control.
*   **Motor Principal:** Rust (Tauri) encargado de la E/S de archivos, limpieza de píxeles (transparencia/Alpha) y gestión del sistema.
*   **Agente Artista (LLM + MCP):** Un modelo de lenguaje de escala media que interpreta peticiones humanas, redacta prompts técnicos y construye dinámicamente los grafos JSON.
*   **Motor de Renderizado:** Integración asíncrona con un nodo local de ComfyUI.

## 🚀 Funcionalidades Principales
*   **Catálogo Dinámico:** Lectura y gestión de catálogos estructurados con intervención del LLM para expansión creativa.
*   **Transparencia Nativa:** Pipeline de Rust para eliminar fondos croma y corregir bordes (anti-aliasing) en sprites de 16-bits.
*   **Procesamiento por Lotes (Batch/Long Inputs):** Sistema de colas robusto. Permite ingresar peticiones masivas (ej. "Genera todos los NPCs de la ciudad") y delegar la carga al Agente. Rembrandt orquestará los tiempos de GPU, monitoreará la VRAM y compilará los resultados mientras el usuario realiza otras tareas.
*   **Sincronización de Proyectos:** Exportación directa y limpia a directorios de desarrollo (ej. `app/src/main/res/drawable/` en Android Studio).

## 🛠️ Desarrollo
Para levantar el entorno de desarrollo:
```bash
pnpm install
pnpm tauri dev
