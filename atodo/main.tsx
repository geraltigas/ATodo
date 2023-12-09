import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";


// import {parse, stringify} from "flatted";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
);

// invoke<string>("open_worker").then((res) => {
//     console.log(res);
// });
//
// const taskStorage = buildTaskStorage();

// const strs: string = stringify(taskStorage);
//
// console.log(strs);

// invoke<string>("save", {key: "taskStorage", value: strs}).then((res) => {
//     console.log(res);
//
// });

// invoke<string>("load", {key: "taskStorage"}).then((res) => {
//     console.log(parse(res));
// });

//     let obj: any = parse(res);
//     // remove all the elements after index 5
//     obj.taskStorage.overall.subtasks.nodes.splice(5, obj.taskStorage.overall.subtasks.nodes.length - 6);
//     console.log(obj);
//     let temp = obj.taskStorage.nowViewing;
//     obj.taskStorage.nowViewing = obj.taskStorage.overall;
//     obj.taskStorage.overall.subtasks.nodes.push(temp);
//     let strs: string = stringify(obj);
//     invoke<string>("save", {key: "taskStorage", value: strs}).then((res) => {
//         console.log(parse(res))
//     })