
import './App.css';

import {
  BrowserRouter as Router,
  Routes,
  Route
  // Link
} from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import MiniDrawer from './components/MiniDrawer';
import AddFriend from './components/AddFriend';
import YourFriend from './components/YourFriend';
import Message from './components/Message';
import Chat from './components/Chat';
import EditProfile from './components/EditProfile';
import React from 'react';
function App() {
  const [theme, setTheme] = React.useState('light');

  const handleChange = (e) => {
    setTheme(e.target.checked ? 'dark' : 'light');
    if (e.target.checked) {
      document.getElementsByClassName('css-1jmjcem')[0].style.backgroundColor = '#000';
      document.getElementsByClassName('css-1jmjcem')[0].style.color = '#fff';
      document.getElementsByClassName('css-1jmjcem')[0].style.minHeight = '100vh';
      document.getElementById('navbar').style.backgroundColor = '#fff';
      document.getElementById('navbar').style.color = '#000';




    }
    else {
      document.getElementsByClassName('css-1jmjcem')[0].style.backgroundColor = '#fff';
      document.getElementsByClassName('css-1jmjcem')[0].style.color = '#000';
      document.getElementsByClassName('css-1jmjcem')[0].style.minHeight = '100vh';
      document.getElementById('navbar').style.backgroundColor = '#1976d2';

    }
  };

  return (
    <>
      <Router>
        <MiniDrawer handleChange={handleChange} >
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<Login mode={theme} />} />
            <Route exact path="/signup" element={<SignUp mode={theme} />} />
            <Route exact path="/addfriend" element={<AddFriend mode={theme} />} />
            <Route exact path="/friends" element={<YourFriend mode={theme} />} />
            <Route exact path="/msg" element={<Message mode={theme} />} />
            <Route exact path="/chat/:id" element={<Chat mode={theme} />} />
            <Route exact path="/editprofile" element={<EditProfile mode={theme} />} />


          </Routes>
        </MiniDrawer>
      </Router>

    </>
  );
}

export default App;
