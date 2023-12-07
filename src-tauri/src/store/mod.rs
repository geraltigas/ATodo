use std::fs::{self, File};
use std::io::{Read, Write};

const DIR: &str = "./store";

#[tauri::command]
pub fn save(key: &str, value: &str) -> Result<String, String> {
    let file_path = format!("{}/{}", DIR, key);

    // Ensure the directory exists
    match fs::create_dir_all(DIR) {
        Ok(_) => {}
        Err(e) => return Err(format!("Failed to create directory: {}", e)),
    }

    // Attempt to create or open the file
    let mut file = match File::create(&file_path) {
        Ok(f) => f,
        Err(e) => return Err(format!("Failed to create file: {}", e)),
    };

    // Write the value to the file
    match file.write_all(value.as_bytes()) {
        Ok(_) => Ok(format!("Value saved to {}", file_path)),
        Err(e) => Err(format!("Failed to write to file: {}", e)),
    }
}

#[tauri::command]
pub fn load(key: &str) -> Result<String, String> {
    let file_path = format!("{}/{}", DIR, key);

    // Attempt to open the file
    let mut file = match File::open(&file_path) {
        Ok(f) => f,
        Err(e) => return Err(format!("Failed to open file: {}", e)),
    };

    // Read the contents of the file
    let mut contents = String::new();
    match file.read_to_string(&mut contents) {
        Ok(_) => Ok(contents),
        Err(e) => Err(format!("Failed to read from file: {}", e)),
    }
}