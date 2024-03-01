import { Routes, Route, Outlet } from "react-router-dom"
import Header from './components/Header/Header';
import Home from './views/Home/Home';
import Login from './views/Login/Login';
import SignUp from './views/SignUp/SignUp'
import EditProfile from "./views/EditProfile/EditProfile";
import HomeUserLoggedIn from "./views/HomeUserLoggedIn/HomeUserLoggedIn";
import UploadPhoto from "./views/UploadPhoto/UploadPhoto";
import EditAlbum from "./views/EditAlbum/EditAlbum";
import SeePhotos from "./views/SeePhotos/SeePhotos";

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
        <Route path="/editprofile/:parameter" element={<EditProfile/>}/>
        <Route path="/homeuserloggedin/:parameter" element={<HomeUserLoggedIn/>}/>
        <Route path="/uploadphoto/:parameter" element={<UploadPhoto/>}/>
        <Route path="/editalbum/:parameter" element={<EditAlbum/>}/>
        <Route path="/seephotos/:parameter" element={<SeePhotos/>}/>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App;
