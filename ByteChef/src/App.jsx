import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from '../src/components/Home'
import Mensal from '../src/components/Mensal'
import Diaria from '../src/components/Diaria'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mensal" element={<Mensal />} />
        <Route path="/diaria" element={<Diaria />} />
        
      </Routes>
    </Router>
  )
}

export default App
