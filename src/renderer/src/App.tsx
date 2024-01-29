import './App.css'
import 'reactflow/dist/style.css'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import ATodo from './pages/AToDo/ATodo'
import Worker from './pages/Worker/Worker'
import {signal} from "@preact/signals";

export enum Page {
  ATodo,
  Worker
}

export const route = signal(Page.ATodo)

export default function App() {
  let view: JSX.Element
  switch (route.value) {
    case Page.ATodo:
      view = <ATodo/>
      break
    case Page.Worker:
      view = <Worker/>
      break
    default:
      view = <ATodo/>
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {view}
    </LocalizationProvider>
  )
}
