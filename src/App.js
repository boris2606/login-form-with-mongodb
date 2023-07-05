import React from "react";
import { Route, Routes,BrowserRouter } from "react-router-dom";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import ProtectedRoutes from "./ProtectedRoutes";
import Layout from "./pages/Layout";
import News from './pages/News/News'
import Posts from './pages/Posts/Posts'
import Admin from './pages/Admin/Admin'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<News/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/signin' element={<SignIn/>}/>
          <Route path='/news' element={<News/> }/>
          <Route path='/posts' element={<Posts/> }/>
          <Route path='/admin-panel' element={<ProtectedRoutes component={ <Admin/> } />}/>
          <Route path='*' element={<Admin/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
