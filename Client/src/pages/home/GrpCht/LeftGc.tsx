import { useEffect, useState } from "react";
import CreateGroup from "./createGroup";
import { useEthereum } from "../../../contexts/contractContext";
import { useNavigate } from "react-router-dom";

interface Props{
setIsGrp:React.Dispatch<React.SetStateAction<boolean>>
}

interface MessageType{
  text: string,
  time:number,
 sender:string
}

interface GroupChatType{
  id:string,
  chatName: string,
  messages: MessageType[],
  members: string[],
  latestMessage: string,
  admin: string,
  gcPic:string,
}

const LeftGC: React.FC<Props> = ({ setIsGrp }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [allGroups, setAllGroups] = useState<GroupChatType[]>([]);
  const { contract } = useEthereum();
  const navigate = useNavigate();

  const getAllGroupChats = async () => {
    try {
      const res: GroupChatType[] = await contract?.getAllGroupChats();
      setAllGroups(res);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllGroupChats();
  }, []);
  return (
    <div>
      <div>
        <div className=" bg-slate-900  neo-shadow p-1">
          <ul className="flex justify-around pb-3 font-bold bg-slate-900">
            <li
              onClick={() => setIsGrp(false)}
              className="bg-slate-900 hover:underline cursor-pointer"
            >
              Individual
            </li>
            <li
              onClick={() => setIsGrp(true)}
              className="bg-slate-900 hover:underline cursor-pointer"
            >
              Group
            </li>
          </ul>
          <input
            type="text"
            placeholder="Search"
            className="bg-slate-700 pl-3 rounded-3xl mb-2 w-full h-9"
          />
          <p
            className="text-4xl bg-lime-600 ml-auto mr-3 w-12  rounded-full cursor-pointer hover:bg-lime-950 px-3"
            title="Create a group"
            onClick={() => setOpen(true)}
          >
            +
          </p>
          <div className=" h-[455px] overflow-scroll">
          { allGroups.length>0 ? allGroups?.map((curval: GroupChatType) => {
            return (
                <div key={curval.id} onClick={()=>navigate(`/?grpOf=${curval.id}`)} className="flex cursor-pointer hover:border-2 border-lime-600 items-center space-x-4 p-4 rounded-lg neo-shadow">
                  <div className="w-12 h-12  rounded-full neo-inset flex items-center justify-center">
                    <img
                      src={
                        curval.gcPic !== ""
                          ? curval.gcPic
                          : "vite.png"
                      }
                      alt=""
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold">{curval.chatName}</h2>
                    <p className="text-sm text-gray-600">
                      {curval.latestMessage}
                    </p>
                  </div>
                </div>
            );
          }) : <p className="text-3xl pl-3">No Group to show</p>}
          </div>
        </div>
      </div>
          <CreateGroup open={open} setOpen={setOpen} />
    </div>
  );
}

export default LeftGC
