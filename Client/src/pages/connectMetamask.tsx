import { ethers } from "ethers";
import { useEthereum } from "../contexts/contractContext";
import abi from "../bytecode/abi.json";

declare global {
  interface Window {
    ethereum: any;
  }
}

const ConnectMetamask = () => {
  const { setState } = useEthereum();

  const connectAccount = async () => {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const contractAbi = abi.abi;

    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });

        const accounts: string[] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length > 0) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractAbi,
            signer
          );

          console.log("Explicitly Connected Account:", accounts[0]);

          setState((prev) => ({
            ...prev,
            signer,
            provider,
            contract,
            account: accounts[0],
          }));
        } else {
          console.log("No accounts connected.");
        }
      } catch (error) {
        console.error("Error connecting MetaMask:", error);
      }
    } else {
      console.log("MetaMask is not installed.");
    }
  };

  
  return (
    <div>
      <section className="text-gray-600 body-font">
        <h1 className="text-center text-5xl text-lime-500 mt-5">
          Please connect MetaMask to continue!
        </h1>
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-2/3 flex flex-col justify-around sm:flex-row sm:items-center mx-auto">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaTIJOgm7Qwws9XEsmz2riEyD66JNU-yyQMw47JxtUV4rNymMN2raY_SmEQ24xppOB-5o&usqp=CAU"
              alt=""
              className="w-80"
            />
            <button
              onClick={connectAccount}
              className="flex-shrink-0 text-white bg-orange-500 border-0 py-2 px-8 focus:outline-none hover:bg-orange-600 rounded text-3xl mt-10 sm:mt-0"
            >
              Connect MetaMask
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConnectMetamask;
