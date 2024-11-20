import { useEffect, useState } from "react";
import { useEthereum } from "../../contexts/contractContext";
import { useNavigate } from "react-router-dom";

interface chatsType {
  name: string | null;
  id: string | null;
  description: string | null;
  image: string | null;
}

const Left = () => {
  const [contacts, setContacts] = useState<chatsType[]>();
  const { contract } = useEthereum();
  const navigate = useNavigate();

    const getChats = async () => {
        try {
          const res = await contract?.getAllChats();
          setContacts(res);
        } catch (error) {
            console.log(error)
        }
    }
  
  useEffect(() => {
    getChats();
    }, [contract]);
  return (
    <div>
      <div className=" bg-slate-900  neo-shadow p-6">
        <h1 className="text-2xl bg-slate-900 font-bold mb-4">Contacts</h1>
        <input
          type="text"
          placeholder="Search"
          className="bg-slate-700 pl-3 rounded-3xl mb-2 w-full h-9"
        />
        <div className="space-y-4 h-[443px] overflow-scroll">
          {contacts?.map((curval: chatsType) => {
            return (
              <div key={curval.id}
                onClick={() => navigate(`/?chatsOf=${curval.id}`)}
                className="flex cursor-pointer hover:border-2 border-lime-600 items-center space-x-4 p-4 rounded-lg neo-shadow"
              >
                <div className="w-12 h-12  rounded-full neo-inset flex items-center justify-center">
                  <img src={curval.image!} alt="" className="rounded-full" />
                </div>
                <div>
                  <h2 className="font-semibold">{curval.name}</h2>
                  <p className="text-sm text-gray-600">
                    latest message rakhnu parxa ya
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Left
