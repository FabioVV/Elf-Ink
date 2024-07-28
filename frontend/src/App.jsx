import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Register from './components/Register';
import Index from './pages';

import './static/css/utils.css'

function App() {
    return (
      <Routes>
        <Route path='/' Component={Home}/>
        <Route path='/register' Component={Register}/>
        <Route path='/index' Component={Index}/>
      </Routes>
    )
}

export default App
