use reqwest::Client;
use serde_json::{json, Value};

#[tauri::command]
pub async fn generar_imagen_comfyui(prompt_generado: String) -> Result<String, String> {
    let client = Client::new();

    let workflow_str = include_str!("../../workflow_api.json");
    let mut workflow: Value = serde_json::from_str(workflow_str)
        .map_err(|e| format!("Error al parsear workflow_api.json: {}", e))?;

    let mut nodo_actualizado = false;
    if let Value::Object(ref mut mapa) = workflow {
        for (_id, nodo) in mapa.iter_mut() {
            let class_type = nodo.get("class_type").and_then(|c| c.as_str()).unwrap_or_default();

            if class_type == "QwenImage21Node" {
                if let Some(inputs) = nodo.get_mut("inputs") {
                    inputs["prompt"] = Value::String(prompt_generado.clone());
                    nodo_actualizado = true;
                    break;
                }
            } else if class_type == "CLIPTextEncode" {
                if let Some(inputs) = nodo.get_mut("inputs") {
                    inputs["text"] = Value::String(prompt_generado.clone());
                    nodo_actualizado = true;
                    break;
                }
            }
        }
    }

    if !nodo_actualizado {
        return Err("No se encontró el nodo QwenImage21Node ni CLIPTextEncode en el workflow.".to_string());
    }

    let payload = json!({ "prompt": workflow });

    let res = client
        .post("http://127.0.0.1:8188/prompt")
        .json(&payload)
        .send()
        .await
        .map_err(|e| format!("Error al conectar con ComfyUI: {}", e))?;

    if res.status().is_success() {
        Ok("Prompt despachado a Monet con éxito.".to_string())
    } else {
        Err(format!("ComfyUI respondió con código: {}", res.status()))
    }
}
