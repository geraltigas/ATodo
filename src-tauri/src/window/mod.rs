use tauri::{WindowBuilder, WindowUrl};

#[tauri::command]
pub fn open_worker(app: tauri::AppHandle) {
    //{
    //  "label": "Worker",
    //  "fullscreen": false,
    //  "resizable": true,
    //  "title": "Worker",
    //  "width": 800,
    //  "height": 600,
    //  "url": "worker/index.html"
    //}
    let _new_window = WindowBuilder::new(&app, "worker", WindowUrl::App("worker/index.html".into()))
        .fullscreen(false)
        .resizable(true)
        .title("Worker")
        .inner_size(800f64, 600f64)
        .build()
        .expect("Error creating window");
}