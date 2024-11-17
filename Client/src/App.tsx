
import { useEffect, useState } from 'react'
import './App.css'
import SighUp from './pages/auth'
import { useEthereum } from './contexts/contractContext';
import { Route, Routes, useNavigate } from 'react-router-dom';
import HomePage from './pages/home';

interface myProfileType {
  name: string,
  id: string,
  description: string,
  image : string ,
}

function App() {
  const [myData, setMyData] = useState<myProfileType | undefined>(undefined);
  const { contract, account } = useEthereum();
  const navigate = useNavigate();

  const getMyProfile = async () => {
    const res = await contract?.profiles(account);
    setMyData(res);
    console.log(res)
  }
  const getAllData = async () => {
    const res = await contract?.getAllProfiles();
    console.log(res);
  }
  
  useEffect(() => {
    getMyProfile();
    getAllData();
  }, [contract , account]);

  useEffect(() => {
    if ( (myData && myData?.id.toLowerCase()) !== account?.toLowerCase()) {
      navigate('/auth');
    }
  },[ myData])
  
  return (
    <>    
      
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/auth' element={<SighUp/>} />
      </Routes>
    </>
  )
}

export default App
