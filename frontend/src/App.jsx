import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Register from './components/Register';

function App() {
    return (
      <Routes>
        <Route path='/' Component={Home}/>
        <Route path='/register' Component={Register}/>
      </Routes>
    )
}

export default App
