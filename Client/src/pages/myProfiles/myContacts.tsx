import { useEffect, useState } from "react";
import { IoPersonRemove } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useEthereum } from "../../contexts/contractContext";
import { IoChatbox } from "react-icons/io5";


interface DataType {
  name: string | null;
  id: string | null;
  description: string | null;
  image: string | null;
}

const MyContacts = () => {
    const [datas, setDatas] = useState<DataType[]>();
    const { contract ,account } = useEthereum();
  const navigate = useNavigate();
  
    const getContacts = async () => {
      try {
        const res = await contract?.getAllProfiles();
       
        const myContacts: DataType[] = [];

        for (const profile of res) {
          const isContact = await contract?.contacts(account, profile.id);
          if (isContact) myContacts.push(profile);
        }
        setDatas(myContacts);
      } catch (error) {
        console.log(error);
      }
    };
  
  const handleStartConversation = async (id:string) => {
    try {
      await contract?.startChat(id, 'Initiated Conversation');
      window.location.href = '/';
    } catch (error) {
      console.log(error)
    }
  }
  
  const handleRemove = async (id:string) => {
    try {
      const transaction = await contract?.deleteContact(id);
      await transaction.wait();
      window.location.reload();
    } catch (error) {
      console.log(error)
    }
  }

    useEffect(() => {
      getContacts();
    }, []);
  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-green-300">
              My Contacts
            </h1>
          </div>
          {datas?.map((curval: any) => {
            return (
              <div className="flex flex-wrap -m-2">
                <div className="p-2 lg:w-1/3 md:w-1/2 w-full">
                  <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
                    <img
                      alt="team"
                      title="view profile"
                      className="w-16 h-16 cursor-pointer bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
                      src={curval.image!}
                      onClick={() => navigate(`/Profile/${curval.id}`)}
                    />
                    <div className="flex-grow">
                      <h2 className="text-yellow-300 flex gap-5  title-font font-medium">
                        {curval.name}
                        <IoPersonRemove title='Remove Contact'
                          onClick={() => handleRemove(curval.id)}
                          className=" cursor-pointer text-red-500 hover:text-[23px] text-xl"
                        />
                        <IoChatbox onClick={()=>handleStartConversation(curval.id)} title="start conversation" className="cursor-pointer text-red-500 hover:text-[23px] text-2xl" />
                      </h2>
                      <p className="text-yellow-500">
                        {curval.description.slice(0, 16)}...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default MyContacts;
