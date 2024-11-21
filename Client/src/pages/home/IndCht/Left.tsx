import { useEffect, useState } from "react";
import { useEthereum } from "../../../contexts/contractContext";
import { useNavigate } from "react-router-dom";

interface chatsType {
  name: string | null;
  id: string | null;
  description: string | null;
  image: string | null;
  latestMessage: string | null;
}
interface Props {
  setIsGrp: React.Dispatch<React.SetStateAction<boolean>>;
}

const Left:React.FC<Props> = ({setIsGrp}) => {
  const [contacts, setContacts] = useState<chatsType[]>();
  const { contract } = useEthereum();
  const [search, setSearch] = useState<string>();
  const navigate = useNavigate();

  const getChats = async () => {
    try {
      const res = await contract?.getAllChats();
      if (res) {
        const chats: chatsType[] = await Promise.all(
          res.map(async (curval: any) => {
            const chat = await contract?.getIndividualChat(curval.id);
            return {
              id: curval.id,
              name: curval.name,
              description: curval.description,
              image: curval.image,
              latestMessage: chat.latestMessage,
            };
          })
        );
        if (search && search.length > 1) {
          const searched: any = chats.filter((curval: any) =>
            curval.name.toLowerCase().includes(search?.toLowerCase())
          );
          setContacts(searched);
        } else {
          setContacts([...chats].reverse());
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    getChats();
  }, [contract, search]);
  return (
    <div>
      <div className=" bg-slate-900  neo-shadow p-6">
        <ul className="flex justify-around pb-3 font-bold bg-slate-900">
          <li onClick={() => { setIsGrp(false)}} className="bg-slate-900 hover:underline cursor-pointer">Individual</li>
          <li onClick={()=>setIsGrp(true)} className="bg-slate-900 hover:underline cursor-pointer">Group</li>
        </ul>
        <input
          type="text"
          placeholder="Search"
          onChange={handleChange}
          className="bg-slate-700 pl-3 rounded-3xl mb-2 w-full h-9"
        />
        <div className="space-y-4 h-[455px] overflow-scroll">
          {contacts?.map((curval: chatsType) => {
            return (
              <div
                key={curval.id}
                onClick={() => navigate(`/?chatsOf=${curval.id}`)}
                className="flex cursor-pointer hover:border-2 border-lime-600 items-center space-x-4 p-4 rounded-lg neo-shadow"
              >
                <div className="w-12 h-12  rounded-full neo-inset flex items-center justify-center">
                  <img src={curval.image!} alt="" className="rounded-full" />
                </div>
                <div>
                  <h2 className="font-semibold">{curval.name}</h2>
                  <p className="text-sm text-gray-600">
                    {curval.latestMessage}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
};

export default Left;
