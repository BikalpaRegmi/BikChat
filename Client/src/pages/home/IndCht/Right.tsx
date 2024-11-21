import { useEffect, useRef, useState } from "react";
import { useEthereum } from "../../../contexts/contractContext";
import { useSearchParams } from "react-router-dom";

interface messageType {
  text: string;
  time: number;
  sender: string;
}

const Right = () => {
  const [allMessages, setAllMessages] = useState<messageType[]>([]);
  const { contract, account } = useEthereum();
  const [otherDetail, setOtherDetail] = useState<any>();
  const [searchParam] = useSearchParams();
  const partnerId = searchParam.get("chatsOf");
  const [text, setText] = useState<string>();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getAllMessages = async () => {
    try {
      if (partnerId) {
        const res = await contract?.getAllMessage(partnerId);
        console.log(res);
        const combinedMessages = [...res].sort(
          (a: messageType, b: messageType) => Number(a.time) - Number(b.time)
        );

        setAllMessages(combinedMessages);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async () => {
    try {
      if (text) {
        const transaction = await contract?.sendMessage(text, partnerId);
        await transaction.wait();
        setText("");
        getAllMessages();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getProfile = async () => {
    try {
      if (partnerId != null) {
        const res = await contract?.profiles(partnerId);
        setOtherDetail(res);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (partnerId) {
      getProfile();
      getAllMessages();
    }
  }, [partnerId]);

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  return (
    <div className="col-span-2">
      {partnerId && (
        <div className="w-full bg-gray-100 dark:bg-slate-900 neo-shadow p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex items-center bg-slate-900 space-x-4">
            <div className="w-12 h-12 rounded-full neo-shadow flex items-center justify-center">
              <img
                src={otherDetail?.image}
                className="rounded-full text-xl font-semibold text-gray-700 dark:text-gray-300"
                alt="Partner"
              />
            </div>
            <h1 className="text-2xl font-bold dark:text-gray-200">
              {otherDetail?.name}
            </h1>
          </div>

          {/* Messages */}
          <div
            ref={scrollToBottom}
            className="h-96 overflow-y-auto neo-inset p-4 rounded-xl space-y-4"
          >
            {allMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start space-x-2 ${
                  msg.sender.toLowerCase() === account?.toLowerCase()
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <i
                  className={`text-slate-500 self-center text-[12px] ${
                    msg.sender.toLowerCase() === account?.toLowerCase()
                      ? "block"
                      : "hidden"
                  }`}
                >
                  {new Date(Number(msg.time) * 1000).toLocaleTimeString()}
                </i>
                <div
                  className={`p-3 rounded-lg neo-shadow max-w-xs ${
                    msg.sender.toLowerCase() === account?.toLowerCase()
                      ? "bg-lime-950 text-white"
                      : "dark:bg-yellow-900 text-gray-700 dark:text-gray-100"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      msg.sender.toLowerCase() === account?.toLowerCase()
                        ? "bg-lime-950"
                        : "bg-yellow-900"
                    }`}
                  >
                    {msg.text}
                  </p>
                </div>
                <i
                  className={`text-slate-500 self-center text-[12px] ${
                    msg.sender.toLowerCase() !== account?.toLowerCase()
                      ? "block"
                      : "hidden"
                  }`}
                >
                  {new Date(Number(msg.time) * 1000).toLocaleTimeString()}
                </i>
              </div>
            ))}{" "}
            <div ref={messagesEndRef} />
          </div>
          {/* Input Field */}
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <input
                value={text}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setText(e.target.value)
                }
                type="text"
                placeholder="Type your message..."
                className="w-full p-4 rounded-xl neo-inset bg-transparent text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
              />
            </div>
            <button
              onClick={sendMessage}
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
      )}
    </div>
  );
};

export default Right;
