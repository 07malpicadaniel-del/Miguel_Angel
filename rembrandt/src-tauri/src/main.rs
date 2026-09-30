#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::llm::redactar_prompt_tecnico,
            commands::comfy::generar_imagen_comfyui,
            commands::procesador::procesar_asset 
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
