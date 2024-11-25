import { ethers } from "ethers";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import abi from "../bytecode/abi.json";

interface ContractStateType {
  signer: ethers.Signer | null;
  provider: ethers.BrowserProvider | null;
  contract: ethers.Contract | null;
  account: string | null;
  setState: Dispatch<SetStateAction<ContractStateType>>;
}



const EthereumContext = createContext<ContractStateType | undefined>(
  undefined
);

export const EthereumContextProvider = ({ children }: any) => {
  const [state, setState] = useState<ContractStateType>({
    signer: null,
    provider: null,
    contract: null,
      account: null,
      setState: () => {},
  });

   const template = async () => {
     const contractAddress = "0x851356ae760d987E095750cCeb3bC6014560891C";
     const contractAbi = abi.abi;

     if (window.ethereum) {
       try {
         const accounts: string[] = await window.ethereum.request({
           method: "eth_requestAccounts",
         });

         window.ethereum.on('accountsChanged', () => {
           window.location.reload();
         })

           const provider = new ethers.BrowserProvider(window.ethereum);
           const signer = await provider.getSigner();
           const contract = new ethers.Contract(
             contractAddress,
             contractAbi,
             signer
           );


           setState((prev) => ({
             ...prev,
             signer,
             provider,
             contract,
             account: accounts[0],
           }));
        
       } catch (error) {
         console.error("Error connecting MetaMask:", error);
       }
     } else {
       console.log("MetaMask is not installed.");
     }
   };
  
  useEffect(() => {
    template();
  },[])
  
  return (
    <EthereumContext.Provider value={ {...state , setState} }>
      {children}
    </EthereumContext.Provider>
  );
};

export const useEthereum = () => {
  const context = useContext(EthereumContext);
  if (!context)
    throw new Error("Please wrap the code inside EthereumContextProvider");
  return context;
};
