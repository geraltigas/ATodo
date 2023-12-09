#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use store::load;
use store::save;
use window::close_atodo;
use window::close_worker;
use window::open_atodo;
use window::open_worker;

mod store;
mod window;

fn main() {
    tauri::Builder::default()
        // store mod
        .invoke_handler(tauri::generate_handler![save,load,open_worker,close_worker,open_atodo,close_atodo])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
