mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::llm::redactar_prompt_tecnico,
            commands::comfy::generar_imagen_comfyui,
            commands::procesador::procesar_asset
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
