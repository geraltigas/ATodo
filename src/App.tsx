import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import AToDo from './pages/AToDo/AToDo';
import 'reactflow/dist/style.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="App">
        {/*<Head />*/}
        <Router>
          <Routes>
            <Route path="/" element={<AToDo />} />
          </Routes>
        </Router>
      </div>
    </LocalizationProvider>
  );
}