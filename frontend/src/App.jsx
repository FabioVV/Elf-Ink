import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Register from './components/Register';
import Index from './pages';

import './static/css/utils.css'
import Bus from './utils/Bus';

window.flash = (message, type="success") => Bus.emit('flash', ({message, type}))

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
