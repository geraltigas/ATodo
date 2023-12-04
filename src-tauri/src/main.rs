#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use store::load;
use store::save;

mod store;

fn main() {
    tauri::Builder::default()
        // store mod
        .invoke_handler(tauri::generate_handler![save,load])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
