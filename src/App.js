
import './App.css';

import {
	BrowserRouter as Router,
	Routes,
	Route
	// Link
} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route exact path="/login" element={<Login/>}/>
        <Route exact path="/signup" element={<SignUp/>}/>
        

      </Routes>
    </Router>
    
    </>
  );
}

export default App;
