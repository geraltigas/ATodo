import './App.css'
import 'reactflow/dist/style.css'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import ATodo from './pages/AToDo/ATodo'
import Worker from './pages/Worker/Worker'

const router = createHashRouter([
  { // default route
    path: '/',
    element: <ATodo />
  },
  {
    path: '/atodo',
    element: <ATodo />
  },
  {
    path: '/worker',
    element: <Worker />
  }
])

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RouterProvider router={router} />
    </LocalizationProvider>
  )
}
