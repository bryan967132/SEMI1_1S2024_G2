import { Routes, Route, Outlet } from "react-router-dom"
import Header from './components/Header/Header';
import Home from './views/Home/Home';
import Login from './views/Login/Login';
import SignUp from './views/SignUp/SignUp'
import EditProfile from "./views/EditProfile/EditProfile";
import HomeUserLoggedIn from "./views/HomeUserLoggedIn/HomeUserLoggedIn";
import UploadPhoto from "./views/UploadPhoto/UploadPhoto";
import EditAlbum from "./views/EditAlbum/EditAlbum";
import SeeFavorite from "./views/SeeFavorite/SeeFavorite";
import SeeResources from "./views/SeeResources/SeeResources";
import SeeResource from "./views/SeeResource/SeeResource";
import TextPhoto from "./views/TextPhoto/TextPhoto";
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
        <Route path="/seefavorite/:user" element={<SeeFavorite/>}/>
        <Route path="/seeresources/:user/:iduser" element={<SeeResources/>}/>
        <Route path="/seeresources/:user/:iduser/seeresource/:idbook/:namebook" element={<SeeResource/>}/>
        <Route path="/textphoto/:user" element={<TextPhoto/>}/>
        <Route path="/chatbot/:user" element={<ChatBot/>}/>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App;
