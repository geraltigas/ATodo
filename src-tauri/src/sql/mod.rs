// struct Task {
//     id: i64,
//     root_task: i64,
//     name: String,
//     goal: String,
//     deadline: i64,
//     time_consumed: i64,
//     status: String,
//     parent: i64,
//     position_x: i64,
//     position_y: i64,
//     suspended_type: String,
//     suspended_info: String,
// }

// struct AppState {
//     root_task: i64,
//     now_viewing_task: i64,
// }

use std::collections::HashMap;
// create a global valuable for sqlite connection and dont init
use std::sync::Mutex;

use lazy_static::lazy_static;
use rusqlite::types::ValueRef;
use serde_json::Value;
lazy_static! {
    static ref DB: Mutex<Option<rusqlite::Connection>> = Mutex::new(None);
}
// return bool
#[tauri::command]
pub fn connect_to_db() -> bool {
    // check DB
    let mut db = DB.lock().expect("Failed to get lock of global var DB");
    if db.is_some() {
        return true;
    }
    // create connection
    let conn = rusqlite::Connection::open("./store/storage.db").unwrap();
    // set connection
    *db = Some(conn);
    true
}

#[tauri::command]
pub fn disconnect_from_db() -> bool {
    let mut db = DB.lock().expect("Failed to get lock of global var DB");
    if db.is_none() {
        return false;
    }
    // Take the connection out of the Mutex and replace it with None
    // This will give us ownership of the Connection, allowing us to close it
    let conn = db.take();
    // Close the connection if it exists
    if let Some(c) = conn {
        // Close the connection
        c.close().expect("Failed to close the connection");
    }
    // set DB to None
    *db = None;
    true
}

#[tauri::command]
pub fn db_force_init() -> bool {
    // check db file exist or not
    // if now exist, init a db file
    let mut db = DB.lock().expect("Failed to get lock of global var DB");
    if db.is_some() {
        return false;
    }
    // create connection
    let conn = rusqlite::Connection::open("./store/storage.db").unwrap();
    // set connection
    *db = Some(conn);
    // read init_data.sql and init_table.sql from ./sql/*
    // execute sql
    let init_table = std::fs::read_to_string("./sql/init_table.sql").unwrap();
    let conn = db.as_mut().unwrap();
    // execute one by one synchronously
    conn.execute_batch(&init_table).unwrap();
    true
}

// input:
// - a array of string - sqls
// output:
// succeed or not - bool
#[tauri::command]
pub fn sqls_modify(sqls: Vec<String>) -> bool {
    let mut db = DB.lock().expect("Failed to get lock of global var DB");
    if db.is_none() {
        return false;
    }
    let sqls_bang: String = sqls.join(";");
    let conn = db.as_mut().unwrap();
    conn.execute_batch(&sqls_bang).unwrap();
    true
}

// function input a string which is a sql
// return the bool
#[tauri::command]
pub fn sql_bool(sql: &str) -> bool {
    let mut db = DB.lock().expect("Failed to get lock of global var DB");
    if db.is_none() {
        return false;
    }
    let conn = db.as_mut().unwrap();
    conn.execute(sql, []).unwrap();
    true
}

#[tauri::command]
pub fn sql_select(sql: &str) -> Vec<String> {
    let mut db = DB.lock().expect("Failed to get lock of global var DB");
    if db.is_none() {
        return vec![];
    }
    let conn = db.as_mut().unwrap();
    let mut stmt = conn.prepare(sql).unwrap();
    let column_names = {
        let temp_stmt = conn.prepare(sql).unwrap();
        temp_stmt
            .column_names()
            .iter()
            .map(|name| name.to_string())
            .collect::<Vec<_>>()
    };
    let mut rows = stmt.query([]).unwrap();
    let mut result = vec![];
    // map<String,String>
    let mut map: HashMap<String, String> = HashMap::new();
    while let Some(row) = rows.next().unwrap() {
        for (i, name) in column_names.iter().enumerate() {
            let value_ref = row.get_ref_unwrap(i);
            let value = match value_ref {
                ValueRef::Text(t) => String::from_utf8_lossy(t).into_owned(),
                ValueRef::Integer(i) => i.to_string(),
                ValueRef::Real(f) => f.to_string(),
                ValueRef::Blob(b) => format!("{:?}", b),
                ValueRef::Null => "null".to_string(),
            };
            map.insert(name.to_string(), Value::String(value).to_string());
        }
        result.push(serde_json::to_string(&map).unwrap());
        map.clear();
    }
    result
}

#[cfg(test)]
mod tests {
    use crate::sql::*;

    #[test]
    fn test_connect_to_db() {
        connect_to_db();
        disconnect_from_db();
        assert!(true);
    }

    #[test]
    fn test_sql_select() {
        db_force_init();
        connect_to_db();
        let result = sql_select("select * from tasks");
        println!("{:?}", result);
        disconnect_from_db();
        assert!(true);
    }

    #[test]
    fn test_sql_force_init() {
        db_force_init();
        disconnect_from_db();
        assert!(true);
    }

    #[test]
    fn test_sql_modify() {
        db_force_init();
        connect_to_db();
        let sqls = vec![
            // "insert into tasks (id, root_task, name, goal, deadline, time_consumed, status, parent, position_x, position_y, suspended_type, suspended_info) values (0, 0,'Work', 'Rise', 4102444800, 0, 'created', -1, 100, 100, NULL, NULL)".to_string(),
            "update tasks set status = 'done' where id = 0".to_string(),
            "update tasks set name = 'test1' where id = 0".to_string(),
        ];
        sqls_modify(sqls);
        let result = sql_select("select * from tasks");
        println!("{:?}", result);
        disconnect_from_db();
        assert!(true);
    }
}
