use reqwest::Client;
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
struct OllamaRequest {
    model: String,
    prompt: String,
    stream: bool,
}

#[derive(Deserialize)]
struct OllamaResponse {
    response: String,
}

#[tauri::command]
pub async fn redactar_prompt_tecnico(
    idea_base: String,
    estilo_arte: String,
    perspectiva: String,
    colores: String,
) -> Result<String, String> {
    let client = Client::new();

    let prompt_sistema = format!(
        "You are an expert game technical artist. Generate an image generation prompt for: '{}'. \
        Style: {}. Perspective: {}. Color palette: {}. \
        CRITICAL REQUIREMENT: The asset must be isolated with native transparent alpha background (RGBA), \
        no background plane, no borders, no padding, crisp silhouettes.",
        idea_base, estilo_arte, perspectiva, colores
    );

    let request = OllamaRequest {
        model: "llama3.1".to_string(),
        prompt: prompt_sistema,
        stream: false,
    };

    let res = client
        .post("http://localhost:11434/api/generate")
        .json(&request)
        .send()
        .await
        .map_err(|e| format!("Error conectando con Ollama: {}", e))?;

    let data: OllamaResponse = res
        .json()
        .await
        .map_err(|e| format!("Error parseando respuesta de Ollama: {}", e))?;

    Ok(data.response)
}
