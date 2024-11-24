import React, { SetStateAction, useEffect, useRef, useState } from "react"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useEthereum } from "../../../contexts/contractContext";
import { FaTrashAlt } from "react-icons/fa";
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { MdModeEditOutline } from "react-icons/md";
import axios from "axios";

interface Props{
    setShowMenu: React.Dispatch<SetStateAction<boolean>>,
    grpData: GroupChatType,
    refreshPg:()=>void,
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



const Menu: React.FC<Props> = ({ setShowMenu, grpData,refreshPg }) => {
    const [members, setMembers] = useState<memberType[]>();
    const { contract ,account} = useEthereum();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [showAdd, setShowAdd] = useState<boolean>(false);
    const [File, setFile] = useState<File>();
    const [toEdit, setToEdit] = useState<string>(grpData.chatName);
    const FileRef = useRef<null | HTMLInputElement>(null);
    const [preview, setPreview] = useState<string>('');

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

            setMembers(allMembers);
            
        } catch (error) {
            console.log(error)
        }
    }

    const handleAdd = async () => {
        try {
            if (showAdd) setShowAdd(false); else setShowAdd(true);

        } catch (error) {
            console.log(error);
        }
    }

    const handleLeaveGroup = async () => {
        try {
            await contract?.leaveGroup(grpData.id);
            navigate('/'); 
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteUser = async (id:string) => {
        try {
           const transaction:any = await contract?.removeMember(id, grpData.id);
            toast('User Deleted Sucessfully');
            await transaction.wait(allMembers);
            allMembers();
        } catch (error) {
            console.log(error)
        }
    }
    const handleRemoveGroup = async () => {
    try {
        await contract?.deleteGroup(grpData.id);
        navigate('/');
    } catch (error) {
        console.log(error)
    }
    }
    
    const handleEdit =  () => {
        if (!isEditing) setIsEditing(true);
        else {
            
            setIsEditing(false);
        }
    }
    useEffect(() => {
        allMembers();
    }, [grpData]);

    
        const handleSubmit = async() => {
            try {
                const formData: FormData = new FormData();
                if (File != null) formData.append('file', File);

                if (File) {            
                    const res: any = await axios.post(
                        "https://api.pinata.cloud/pinning/pinFileToIPFS",
   formData,
   {
     headers: {
       pinata_api_key: import.meta.env.VITE_Pinata_api_key,
       pinata_secret_api_key: import.meta.env.VITE_Pinata_secret_api_key,
     },
   }
 );
                const imgUrl: string = "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash; 
                
                const data = {
                    name: toEdit,
                    image:  imgUrl ,
                    id:grpData.id,
                }
                if (toEdit && toEdit?.length < 0) toast("Name mustnt be empty");
                await contract?.editGroup(data.name, data.image, data.id);
                }
                else {
                    const dataWithoutImg = {
                        image : grpData.gcPic,
                        name: toEdit,
                        id:grpData.id,
                    }
                      if (toEdit && toEdit?.length < 0)
                        toast("Name mustnt be empty");
                      await contract?.editGroup(
                          dataWithoutImg.name,
                          dataWithoutImg.image,
                        dataWithoutImg.id
                      );
}


                refreshPg();
                
            } catch (error) {
                console.log(error)
            }
        }

   
    
  return (
    <div className="w-full ">
      <span className=" flex px-3 justify-between">
        <FaArrowLeft
          onClick={() => setShowMenu(false)}
          className="text-5xl cursor-pointer hover:bg-yellow-700 p-1 rounded-full ml-3"
        />

        {grpData.admin.toLowerCase() !== account?.toLowerCase() ? (
          <button
            onClick={handleLeaveGroup}
            className="flex text-3xl pt-1 hover:bg-red-500 rounded-3xl px-3  bg-red-700"
          >
            Leave
            <FaArrowRight className=" bg-red-700  text-4xl cursor-pointer hover:bg-yellow-700 p-1 rounded-full mt-1" />
          </button>
        ) : (
          <button
            onClick={handleRemoveGroup}
            className="flex h-9 text-lg pt-1 hover:bg-red-500 rounded-3xl px-3  bg-red-700"
          >
            Delete Group
            <FaArrowRight className=" bg-red-700  text-xl cursor-pointer hover:bg-yellow-700 p-1 rounded-full mt-1" />
          </button>
        )}
      </span>
      <div className=" flex relative flex-col">
        <span className="self-center flex">
          {!isEditing ? (
            <img
              className="rounded-full  w-36"
              src={grpData.gcPic === "" ? "vite.png" : grpData.gcPic}
              alt=""
            />
          ) : (
            <>
              <h1
                onClick={() => FileRef.current?.click()}
                className={`text-9xl mb-3 w-36 h-36 cursor-pointer border-2 ${
                  preview === "" ? "block" : "hidden"
                } rounded-full text-center`}
              >
                +
              </h1>
              <img
                src={preview}
                alt=""
                className={`mb-3 w-36 h-36 cursor-pointer border-2 rounded-full ${
                  preview !== "" ? "block" : "hidden"
                } `}
              />
            </>
          )}
          <MdModeEditOutline
            onClick={handleEdit}
            title="Edit"
            className="justify-right text-xl cursor-pointer  text-right"
          />
          <input
            type="file"
            ref={FileRef}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const selectedFile = e.target.files && e.target.files[0];
              if (selectedFile) {
                setFile(selectedFile);
                setPreview(URL.createObjectURL(selectedFile));
              }
            }}
          
            
            className="hidden"
          />
        </span>

        <span className="self-center flex ">
          <input
            type="text"
            disabled={!isEditing}
            name="name"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setToEdit(e.target.value)
            } 
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
            value={toEdit ?? grpData.chatName ?? ""}
            className={`self-center ml-12 text-xl ${
              isEditing ? "border-2 border-blue-500 pl-1" : ""
            }`}
          />
        </span>

        <button
          onClick={handleAdd}
          className="p-1 bg-yellow-700 w-36 mx-auto mt-5 rounded-xl font-semibold hover:font-mono"
        >
          AddMember +{" "}
        </button>

        {showAdd ? (
          <div className="h-32 overflow-scroll ">
            <ul className="flex gap-3  mx-auto mt-1  w-64">
              <li>
                <img className="h-9   w-9 rounded-full" src="logo.png" alt="" />
              </li>
              <li className="text-lg  self-center">Bikalpa Regmi</li>
              <li className="text-2xl hover:bg-lime-800 rounded-full cursor-pointer px-2">
                +
              </li>
            </ul>
          </div>
        ) : (
          ""
        )}
        <div className="members overflow-scroll h-28 mt-9 self-center">
          <h1 className="text-2xl font-bold">Members</h1>
          <ul className={`${showAdd ? "grid" : "block"} gap-1  grid-cols-3`}>
            {members && members?.length > 0
              ? members.map((curval: memberType) => {
                  return (
                    <li key={curval.id} className="flex gap-3 mt-3">
                      <img
                        className="w-12  h-12 rounded-full"
                        src={curval.image}
                        alt=""
                      />
                      <b className="self-center">{curval.name}</b>
                      <FaTrashAlt
                        title="remove user"
                        onClick={() => handleDeleteUser(curval.id)}
                        className={`${
                          grpData.admin.toLowerCase() === account?.toLowerCase()
                            ? "block"
                            : "hidden"
                        } cursor-pointer self-center hover:rounded-full hover:bg-red-500`}
                      />
                    </li>
                  );
                })
              : "No Members"}
          </ul>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Menu
