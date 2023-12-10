import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import {Scheduler} from "./lib/Scheduler.ts";
// import {parse} from "flatted";


// import {parse, stringify} from "flatted";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
);

Scheduler.loadAppStorage();


//
// invoke<string>("save", {key: "taskStorage", value: strs}).then((res) => {
//     console.log(res);
//
// });


// invoke<string>("load", {key: "taskStorage"}).then((res) => {
//     console.log(parse(res));
//     // let obj: AppStorage = parse(res);
// });