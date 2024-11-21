import { useEffect, useState } from "react";
import Contacts from './Contacts';
import NavBar from "../../components/navBar";
import { useParams } from "react-router-dom";
import { useEthereum } from "../../contexts/contractContext";

interface MyDataType {
  name: string | null;
  id: string | null;
  description: string | null;
  image: string | null;
}

const Profile = () => {
  const [details, setDetails] = useState<MyDataType>();
  const { id } = useParams();
  const { contract ,account} = useEthereum();
  const [isPartner, setIsPartner] = useState<boolean>();

  const getDetail = async () => {
    try {
      if (contract) {
        const res = await contract?.profiles(id);
        setDetails(res);
        console.log(res)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const checkPartnerOrNot = async () => {
    try {  
        const res = await contract?.contacts(account, id)
      if (res) {
        setIsPartner(true);
      }
      else{
        setIsPartner(false);
      }
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  const addToContact = async () => {
  try {
    await contract?.addToContact(id);
    setIsPartner(true);
  } catch (error) {
    console.log(error)
  }
  }
  
  const removeFromContact = async () => {
    try {
      await contract?.deleteContact(id);
      setIsPartner(false);
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getDetail();
  }, [contract, id]);
  
  useEffect(() => {
    checkPartnerOrNot();
  }, [isPartner, id]);

  return (
    <div>
      <NavBar />
      <section className="mt-10 p-4">
        <div className="w-full md:w-1/2 md:mx-auto flex flex-col md:flex-row items-center justify-center text-center">
          <img
            className="inline-flex object-cover border-4 border-green-900 rounded-full shadow-[5px_5px_0_0_rgba(0,0,0,1)]  h-24 w-24 shadow-lime-900/100 bg-indigo-50  mb-4 md:mb-0 ml-0 md:mr-5"
            src={details?.image!}
            alt=""
          />
          <div className="flex flex-col">
            <div className="md:text-justify mb-3">
              <div className="flex flex-col mb-5">
                <span className="flex gap-5">
                  <p className="text-lime-300 font-bold text-xl">
                    {details?.name}
                  </p>
                  {!isPartner ? (
                    <button onClick={addToContact} className="bg-lime-700 hover:font-semibold text-white px-2 font-bold">
                      Add To Contact
                    </button>
                  ) : (
                    <button onClick={removeFromContact} className="bg-red-700 hover:font-semibold text-white px-2 font-bold">
                      Remove From Contact
                    </button>
                  )}
                </span>
              </div>

              <p className="text-green-500 font-semibold text-center md:text-left">
                {details?.description}{" "}
              </p>
            </div>
          </div>
        </div>
      </section>
      <Contacts />
    </div>
  );
};

export default Profile;
