import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";


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
//     let obj: AppStorage = parse(res);
// obj.taskStorage.overall.subtasks.nodes.splice(0, obj.taskStorage.overall.subtasks.nodes.length);
// obj.taskStorage.overall.subtasks.edges.splice(0, obj.taskStorage.overall.subtasks.edges.length);
// obj.taskStorage.styleMap.splice(0, obj.taskStorage.styleMap.length);


// obj.taskStorage.overall.subtasks.nodes.forEach((node) => {
//     let dateA = dayjs(node.date);
//     let timeA = dayjs(node.time);
//     node.deadline = dateA.set('hour', timeA.hour()).set('minute', timeA.minute()).set('second', 0).toString();
//     // remove time and date in node
//     delete node.date;
//     delete node.time;
// });
//
//
// let dateB = dayjs(obj.taskStorage.overall.date);
// let timeB = dayjs(obj.taskStorage.overall.time);
// obj.taskStorage.overall.deadline = dateB.set('hour', timeB.hour()).set('minute', timeB.minute()).set('second', 0).toString();
// delete obj.taskStorage.overall.date;
// delete obj.taskStorage.overall.time;
//
// obj.taskStorage.overall.subtasks.nodes.splice(5, 1);

// remove all the elements after index 5
// obj.taskStorage.overall.subtasks.nodes[0].subtasks = {
//     nodes: [],
//     edges: []
// }
// obj.taskStorage.overall.subtasks.nodes[1].subtasks = {
//     nodes: [],
//     edges: []
// }
// obj.taskStorage.overall.subtasks.nodes[2].subtasks = {
//     nodes: [],
//     edges: []
// }
// obj.taskStorage.overall.subtasks.nodes[3].subtasks = {
//     nodes: [],
//     edges: []
// }
// obj.taskStorage.overall.subtasks.nodes[4].subtasks = {
//     nodes: [],
//     edges: []
// }
// console.log(obj);
// let temp = obj.taskStorage.nowViewing;
// obj.taskStorage.nowViewing = obj.taskStorage.overall;
// obj.taskStorage.overall.subtasks.nodes.push(temp);
// obj.taskStorage.overall.subtasks.nodes[0].subtasks.nodes.pop();
//     let strs: string = stringify(obj);
//     invoke<string>("save", {key: "taskStorage", value: strs}).then((res) => {
//         console.log(res)
//     })
// });

