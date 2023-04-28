
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
import  MiniDrawer from './components/MiniDrawer';
import AddFriend from './components/AddFriend';
import YourFriend from './components/YourFriend';
import Message from './components/Message';
import Chat from './components/Chat';
function App() {
  return (
    <>
    <Router>
      <MiniDrawer>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route exact path="/login" element={<Login/>}/>
        <Route exact path="/signup" element={<SignUp/>}/>
        <Route exact path="/addfriend" element={<AddFriend/>}/>
        <Route exact path="/friends" element={<YourFriend/>}/>
        <Route exact path="/msg" element={<Message/>}/>
        <Route exact path="/chat/:id" element={<Chat/>}/>
        

      </Routes>
      </MiniDrawer>
    </Router>
    
    </>
  );
}

export default App;
