use image::{GenericImageView, Rgba};
use std::collections::VecDeque;
use std::fs;
use std::path::PathBuf;
use std::time::SystemTime;

#[tauri::command]
pub async fn procesar_asset(directorio: String) -> Result<String, String> {
    let dir_path = std::path::Path::new(&directorio);
    if !dir_path.exists() {
        return Err("El directorio de salida no existe.".to_string());
    }

    // 1. Localizar el PNG más reciente que no sea un asset ya limpiado
    let mut ultima_imagen: Option<PathBuf> = None;
    let mut tiempo_mas_reciente = SystemTime::UNIX_EPOCH;

    let entradas = fs::read_dir(dir_path).map_err(|e| e.to_string())?;
    for entrada in entradas.flatten() {
        let path = entrada.path();
        if path.is_file() && path.extension().unwrap_or_default() == "png" {
            let nombre = path.file_name().unwrap_or_default().to_string_lossy();
            if !nombre.contains("_limpio") {
                if let Ok(metadata) = fs::metadata(&path) {
                    if let Ok(modificado) = metadata.modified() {
                        if modificado > tiempo_mas_reciente {
                            tiempo_mas_reciente = modificado;
                            ultima_imagen = Some(path);
                        }
                    }
                }
            }
        }
    }

    let ruta_entrada = ultima_imagen.ok_or("No se encontraron imágenes nuevas en el directorio.")?;
    let nombre_original = ruta_entrada.file_stem().unwrap().to_string_lossy();
    let ruta_salida = dir_path.join(format!("{}_limpio.png", nombre_original));

    let img = image::open(&ruta_entrada).map_err(|e| format!("Error al abrir imagen: {}", e))?;
    let (width, height) = img.dimensions();
    let mut img_buffer = img.to_rgba8();

    // 2. Evaluar si la imagen posee canal Alfa nativo (Qwen 2.1)
    let mut tiene_transparencia = false;
    for pixel in img_buffer.pixels() {
        if pixel[3] < 240 {
            tiene_transparencia = true;
            break;
        }
    }

    // 3. Fallback: Si no tiene transparencia, aplicar Flood Fill (BFS) desde los bordes
    if !tiene_transparencia {
        let mut visited = vec![false; (width * height) as usize];
        let mut queue = VecDeque::new();

        let es_fondo = |r: u8, g: u8, b: u8| -> bool {
            let es_verde = g > 140 && r < 110 && b < 110;
            let es_blanco_o_gris = (r > 200 && g > 200 && b > 200) || (r == g && g == b && r > 180);
            es_verde || es_blanco_o_gris
        };

        for x in 0..width {
            queue.push_back((x, 0));
            queue.push_back((x, height - 1));
        }
        for y in 0..height {
            queue.push_back((0, y));
            queue.push_back((width - 1, y));
        }

        while let Some((x, y)) = queue.pop_front() {
            let idx = (y * width + x) as usize;
            if visited[idx] { continue; }
            visited[idx] = true;

            let pixel = img_buffer.get_pixel(x, y);
            if es_fondo(pixel[0], pixel[1], pixel[2]) {
                img_buffer.put_pixel(x, y, Rgba([0, 0, 0, 0]));

                if x > 0 { queue.push_back((x - 1, y)); }
                if x < width - 1 { queue.push_back((x + 1, y)); }
                if y > 0 { queue.push_back((x, y - 1)); }
                if y < height - 1 { queue.push_back((x, y + 1)); }
            }
        }
    }

    // 4. Calcular Bounding Box por canal Alfa
    let mut min_x = width;
    let mut min_y = height;
    let mut max_x = 0;
    let mut max_y = 0;
    let mut pixeles_visibles = 0;

    for (x, y, pixel) in img_buffer.enumerate_pixels() {
        if pixel[3] > 0 {
            pixeles_visibles += 1;
            if x < min_x { min_x = x; }
            if y < min_y { min_y = y; }
            if x > max_x { max_x = x; }
            if y > max_y { max_y = y; }
        }
    }

    if pixeles_visibles == 0 || min_x > max_x || min_y > max_y {
        return Err("No se encontraron píxeles útiles para recortar.".to_string());
    }

    let ancho = max_x - min_x + 1;
    let alto = max_y - min_y + 1;

    let cropped = image::imageops::crop(&mut img_buffer, min_x, min_y, ancho, alto);
    cropped.to_image().save(&ruta_salida).map_err(|e| format!("Error guardando asset: {}", e))?;

    Ok(format!(
        "Asset extraído: '{}' [{}x{} px -> {}x{} px]",
        nombre_original, width, height, ancho, alto
    ))
}
