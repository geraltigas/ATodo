import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import AToDo from './pages/AToDo/AToDo';
import Head from './components/Head/Head';
import 'reactflow/dist/style.css';

export default function App() {
  return (
    <div className='App'>
      <Head />
      <Router>
        <Routes>
          <Route path='/' element={<AToDo />} />
        </Routes>
      </Router>
    </div>
  );
}
