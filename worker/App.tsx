import {MemoryRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import 'reactflow/dist/style.css';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import Worker from './pages/Worker/Worker';

export default function App() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="App">
                {/*<Head />*/}
                <Router>
                    <Routes>
                        <Route path="/" element={<Worker/>}/>
                    </Routes>
                </Router>
            </div>
        </LocalizationProvider>
    );
}
