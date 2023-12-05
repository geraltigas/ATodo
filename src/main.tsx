import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import {buildTaskStorage} from "./lib/task/Task.ts";
import {parse, stringify} from "flatted";
import {invoke} from "@tauri-apps/api";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
);

const taskStorage = buildTaskStorage();

const strs: string = stringify(taskStorage);

console.log(strs);

invoke<string>("save", {key: "taskStorage", value: strs}).then((res) => {
    console.log(res);
    invoke<string>("load", {key: "taskStorage"}).then((res) => {
        return console.log(parse(res));
    });
});
