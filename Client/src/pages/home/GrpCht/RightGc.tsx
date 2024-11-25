import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEthereum } from "../../../contexts/contractContext";
import { CiMenuKebab } from "react-icons/ci";
import Menu from "./menu";
import { GrAttachment } from "react-icons/gr";
import axios from "axios";

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
  pp:string
}

const RightGc = () => {
  const [searchParam] = useSearchParams();
  const grpId = searchParam.get('grpOf');
  const { contract,account } = useEthereum();
  const [grpData, setGrpData] = useState<GroupChatType>();
  const [message, setMessage] = useState<string>();
  const [allMessages, setAllMessages] = useState<MessageType[]>([]);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const FileRef = useRef<null | HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>('');
  const [file, setFile] = useState<File>();

  const getGroupData = async () => {
    try {
      if (contract && grpId) {
        const res = await contract?.getIndividualGroupChat(grpId);
        setGrpData(res);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getAllMessage = async() => {
    try {
      if (grpId) {
        const res: any = await contract?.getAllMessageOfGroup(grpId);
        if (res) {
          const msgWithSender: MessageType[] = await Promise.all(
            res.map(async (curval: any) => {
              const profile: any = await contract?.profiles(curval.sender);
              return {
                text: curval.text,
                time: curval.time,
                sender: curval.sender,
                pp: profile.image,
              }
            })
          );
          setAllMessages(msgWithSender);
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const addMessage = async () => {
    try {
      if (message && message.length > 0) {
        const res = await contract?.addMessage(message, grpId);
        await res.wait();
        setMessage('');
        getAllMessage();
      } else if (file) {
        const formData: FormData = new FormData();
        if (file != null) formData.append('file', file);

        if (file) {
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
                 await contract?.addMessage(imgUrl, grpId);
          getAllMessage();
          setPreview('');
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getGroupData();
    getAllMessage();
  }, [grpId]);

  return (
    <div className="col-span-2">
      {grpId && !showMenu ? (
        <div className="w-full bg-gray-100 dark:bg-slate-900 neo-shadow p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex items-center bg-slate-900 space-x-4">
            <div className="w-12 h-12 rounded-full neo-shadow flex items-center justify-center">
              <img
                src={grpData?.gcPic == "" ? "vite.png" : grpData?.gcPic}
                className="rounded-full text-xl font-semibold text-gray-700 dark:text-gray-300"
                alt="Partner"
              />
            </div>
            <h1 className="text-2xl font-bold bg-slate-900 dark:text-gray-200">
              {grpData?.chatName}
            </h1>
            <CiMenuKebab
              onClick={() => setShowMenu(true)}
              className="cursor-pointer"
            />{" "}
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto neo-inset p-4 rounded-xl space-y-4">
            {allMessages.map((curval: MessageType) => {
              return (
                <div
                  key={curval.time}
                  className={`flex gap-3 items-start ${
                    curval.sender.toLowerCase() === account?.toLowerCase()
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <img
                    className={`h-9 cursor-pointer w-9 rounded-full ${
                      curval.sender.toLowerCase() !== account?.toLowerCase()
                        ? "block"
                        : "hidden"
                    }`}
                    alt=""
                    onClick={() => navigate(`/Profile/${curval.sender}`)}
                    src={curval.pp!}
                  />
                  <i
                    className={`text-slate-500 self-center text-[12px] ${
                      curval.sender.toLowerCase() === account?.toLowerCase()
                        ? "block"
                        : "hidden"
                    }`}
                  >
                    {new Date(Number(curval.time) * 1000).toLocaleTimeString()}
                  </i>
                  {curval.text.startsWith("http") 
                   ? (
                    <img
                      src={curval.text}
                      alt="Sent image"
                      className="max-w-xs rounded-md"
                    />
                  ) : (
                    <p
                      className={`text-sm py-1 px-5 rounded-md ${
                        curval.sender.toLowerCase() === account?.toLowerCase()
                          ? "bg-lime-950"
                          : "bg-yellow-900"
                      }`}
                    >
                      {curval.text}
                    </p>
                  )}
                  <i
                    className={`text-slate-500 mt-1 text-[12px] ${
                      curval.sender.toLowerCase() !== account?.toLowerCase()
                        ? "block"
                        : "hidden"
                    }`}
                  >
                    {new Date(Number(curval.time) * 1000).toLocaleTimeString()}
                  </i>
                </div>
              );
            })}

            <div />
          </div>
          <span
            className={`absolute bottom-20 right-9 ${
              preview == "" ? "hidden" : "block"
            }`}
          >
            <b
              onClick={() => setPreview("")}
              className="hover:border-2 cursor-pointer px-1 rounded-full "
            >
              x
            </b>
            <img src={preview} alt="" className="  w-36" />
          </span>
          {/* Input Field */}
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <input
                type="text"
                value={message}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setMessage(e.target.value)
                }
                disabled={preview==''?false:true}
                placeholder="Type your message..."
                className="w-full p-4 rounded-xl neo-inset bg-transparent text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
              />
            </div>

            <input
              type="file"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const selectedFile = e.target.files && e.target.files[0];
                if (selectedFile) {
                  setFile(selectedFile);
                  setPreview(URL.createObjectURL(selectedFile));
                }
              }}
              ref={FileRef}
              className="hidden"
            />
            <GrAttachment
              onClick={() => FileRef?.current?.click()}
              className={`text-xl cursor-pointer ${
                message && message.length > 0 ? "hidden" : "block"
              }`}
            />
            <button
              onClick={addMessage}
              className="p-4 rounded-xl neo-shadow neo-button focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        grpId && (
          <Menu
            setShowMenu={setShowMenu}
            grpData={grpData!}
            refreshPg={getGroupData}
          />
        )
      )}
    </div>
  );
}

export default RightGc
