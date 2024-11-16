import { ethers } from "ethers";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

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
