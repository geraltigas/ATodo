import './App.css';
import AToDo from './pages/AToDo/AToDo';
import 'reactflow/dist/style.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="App">
        {/*<Head />*/}<AToDo />
      </div>
    </LocalizationProvider>
  );
}
