import { Routes, Route, Outlet } from "react-router-dom"
import Header from './components/Header/Header';
import Home from './views/Home/Home';
import Login from './views/Login/Login';
import SignUp from './views/SignUp/SignUp'
import EditProfile from "./views/EditProfile/EditProfile";
import HomeUserLoggedIn from "./views/HomeUserLoggedIn/HomeUserLoggedIn";
import UploadPhoto from "./views/UploadPhoto/UploadPhoto";
import EditAlbum from "./views/EditAlbum/EditAlbum";
import SeeResources from "./views/SeeResources/SeeResources";
import TextPhoto from "./views/TextPhoto/TextPhoto";
import Translate from "./views/Translate/Transalte";
import ChatBot from "./views/Chat/Chat"

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

function App() {

  return (
    <div className="container-fluid">
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path="/editprofile/:user" element={<EditProfile/>}/>
        <Route path="/homeuserloggedin/:user" element={<HomeUserLoggedIn/>}/>
        <Route path="/uploadphoto/:user" element={<UploadPhoto/>}/>
        <Route path="/editalbum/:user" element={<EditAlbum/>}/>
        <Route path="/seeresources/:user" element={<SeeResources/>}/>
        <Route path="/textphoto/:user" element={<TextPhoto/>}/>
        <Route path="/translate/:user" element={<Translate/>}/>
        <Route path="/chatbot/:user" element={<ChatBot/>}/>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App;
