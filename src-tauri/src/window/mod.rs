use std::sync::Mutex;

use lazy_static::lazy_static;
use tauri::{AppHandle, WindowBuilder, WindowUrl};

lazy_static! {
    static ref WINDOW: Mutex<Option<tauri::Window>> = Mutex::new(None);
}

#[tauri::command]
pub fn open_worker(app: AppHandle) -> Result<String, String> {
    // print
    println!("open_worker");

    let mut window = WINDOW.lock().map_err(|e| e.to_string())?;

    if window.is_none() {
        println!("open_worker create new window");
        let new_window = WindowBuilder::new(&app, "worker", WindowUrl::App("worker/index.html".into()))
            // .fullscreen(false)
            // .resizable(true)
            // .title("Worker")
            // .inner_size(800f64, 600f64)
            .build().unwrap();
        /*  .map_err(|e| {
              println!("open_worker create new window error");
              e.to_string()
          })?;*/

        println!("open_worker set window");
        *window = Some(new_window);
        println!("open_worker set window end");
    }

    println!("open_worker end");

    Ok("Worker window opened".to_string())
}

#[tauri::command]
pub fn close_worker() -> Result<String, String> {
    let mut window = WINDOW.lock().map_err(|e| e.to_string())?;

    if let Some(w) = window.take() {
        w.close().map_err(|e| e.to_string())?;
    }

    Ok("Worker window closed".to_string())
}
