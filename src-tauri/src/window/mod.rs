use tauri::{AppHandle, WindowBuilder, WindowUrl};
use tauri::Manager;

#[tauri::command]
pub async fn open_worker(app: AppHandle) -> Result<String, String> {
    // check worker created
    let worker_window = app.get_window("worker");
    if worker_window.is_some() {
        return Ok("Worker window already opened".to_string());
    }

    WindowBuilder::new(&app, "worker", WindowUrl::App("worker/index.html".into()))
        .fullscreen(false)
        .resizable(true)
        .title("Worker")
        .inner_size(800f64, 600f64)
        .build()
        .map_err(|e| {
            e.to_string()
        })?;

    Ok("Worker window opened".to_string())
}

#[tauri::command]
pub async fn close_worker(app: AppHandle) -> Result<String, String> {
    let worker_window = app.get_window("worker").unwrap();
    worker_window.close().map_err(|e| e.to_string())?;
    Ok("Worker window closed".to_string())
}

#[tauri::command]
pub async fn close_atodo(app: AppHandle) -> Result<String, String> {
    let worker_window = app.get_window("atodo").unwrap();
    worker_window.close().map_err(|e| e.to_string())?;
    Ok("ATodo window closed".to_string())
}

#[tauri::command]
pub async fn open_atodo(app: AppHandle) -> Result<String, String> {
    // check worker created
    let worker_window = app.get_window("atodo");
    if worker_window.is_some() {
        return Ok("ATodo window already opened".to_string());
    }

    WindowBuilder::new(&app, "atodo", WindowUrl::App("atodo/index.html".into()))
        .fullscreen(false)
        .resizable(true)
        .title("ATodo")
        .inner_size(800f64, 600f64)
        .build()
        .map_err(|e| {
            e.to_string()
        })?;


    Ok("ATodo window opened".to_string())
}