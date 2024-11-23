import React, { SetStateAction, useEffect, useState } from "react"
import { FaArrowLeft } from "react-icons/fa";
import { useEthereum } from "../../../contexts/contractContext";

interface Props{
    setShowMenu: React.Dispatch<SetStateAction<boolean>>
    grpData:GroupChatType
}
interface GroupChatType {
  id: string;
  chatName: string;
  messages: MessageType[];
  members: string[];
  latestMessage: string;
  admin: string;
  gcPic: string;
}

interface MessageType {
  text: string;
  time: number;
  sender: string;
  pp: string;
}

interface memberType{
    image: string,
    name: string,
    id:string,
}

const Menu: React.FC<Props> = ({ setShowMenu, grpData }) => {
    const [members, setMembers] = useState<memberType[]>();
    const { contract } = useEthereum();

    const allMembers = async() => {
        try {
            const allMembers = await Promise.all(
                grpData.members.map(async(curval: string) => {
                    const profile: any = await contract?.profiles(curval);
                    return {
                        image :  profile.image,
                        name: profile.name,
                       id: profile.id,      
                    }
                })
            )

          charge sakyo ali kati baki xa aayexi mila
            setMembers(allMembers);
            
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        allMembers();
    }, [grpData]);
    
  return (
    <div className="w-full">
      <FaArrowLeft
        onClick={() => setShowMenu(false)}
        className="text-5xl cursor-pointer hover:bg-yellow-700 p-1 rounded-full ml-3"
      />
      <div className=" flex  flex-col">
              <img className="rounded-full self-center w-36" src={grpData.gcPic === "" ? "vite.png" : grpData.gcPic} alt="" />
              <h1 className="self-center text-xl">{grpData.chatName}</h1>
              
              <div className="members mt-9 self-center">
                  <h1 className="text-2xl font-bold">Members</h1>
                  <ul>
                      {
                         members && members.map((curval:memberType)=>{
                              return (                     
                                  <li>
                                      <img src={curval.image} alt="" />
                                  </li>
                            )
                          })
                  }
                  </ul>
              </div>
      </div>
    </div>
  );
}

export default Menu
