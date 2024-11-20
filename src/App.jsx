import Register from './components/authentication/Register'
import Login from './components/authentication/Login'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import TodoHome from './components/TodoHome'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<TodoHome />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
