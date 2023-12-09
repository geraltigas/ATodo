#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use store::load;
use store::save;
use window::open_worker;

mod store;
mod window;

fn main() {
    tauri::Builder::default()
        // store mod
        .invoke_handler(tauri::generate_handler![save,load,open_worker])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
