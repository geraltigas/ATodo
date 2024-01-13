#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use sql::db_force_init;
use sql::sql_bool;
use sql::sql_select;
use sql::sqls_modify;
use store::load;
use store::save;
use window::close_atodo;
use window::close_worker;
use window::open_atodo;
use window::open_worker;
use window::set_window_size;

pub mod sql;
pub mod store;
pub mod window;

fn main() {
    tauri::Builder::default()
        // store mod
        .invoke_handler(tauri::generate_handler![
            save,
            load,
            open_worker,
            close_worker,
            open_atodo,
            close_atodo,
            set_window_size,
            sql_select,
            sql_bool,
            sqls_modify,
            db_force_init,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
