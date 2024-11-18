
import { useEffect } from 'react'
import './App.css'
import SighUp from './pages/auth'
import { useEthereum } from './contexts/contractContext';
import { Route, Routes, useNavigate } from 'react-router-dom';
import HomePage from './pages/home';
import MyProfile from './pages/myProfiles';
import Contacts from './pages/contacts';
import Profile from './pages/Profile';
import { useMyData } from './contexts/myDataContext';


function App() {
  const {  account } = useEthereum();
  const { id } = useMyData();
  const navigate = useNavigate();
 

  useEffect(() => {
    if ( (id?.toLowerCase()) !== account?.toLowerCase()) {
      navigate('/auth');
    }
  },[ id,account])
  
  return (
    <>    
      
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/auth' element={<SighUp />} />
        <Route path='/account' element={<MyProfile />} />
        <Route path='/Profile/:id' element={<Profile />} />
        <Route path='/contacts' element={ <Contacts/>} />
      </Routes>
    </>
  )
}

export default App
