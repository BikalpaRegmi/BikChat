import { useEffect, useState } from 'react';
import SignINComponent from './signIn'
import { useEthereum } from '../../contexts/contractContext';
import { useNavigate } from 'react-router-dom';

interface myProfileType {
  name: string;
  id: string;
  description: string;
  image: string;
}

const SighUp = () => {
  const [myData, setMyData] = useState<myProfileType | undefined>(undefined);
  const { contract, account } = useEthereum();
  const navigate = useNavigate();

  const getMyProfile = async () => {
    const res = await contract?.profiles(account);
    setMyData(res);
  };
  const getAllData = async () => {
     await contract?.getAllProfiles();
  };

  useEffect(() => {
    getMyProfile();
    getAllData();
  }, [contract, account]);

  useEffect(() => {
    if ((myData && myData?.id.toLowerCase()) == account?.toLowerCase()) {
      navigate("/");
    }
  }, [myData]);
  return (
    <div>
      <SignINComponent/>
    </div>
  )
}

export default SighUp
