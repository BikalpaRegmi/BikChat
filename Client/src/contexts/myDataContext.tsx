import { createContext, useContext, useEffect, useState } from "react";
import { useEthereum } from "./contractContext";

interface MyDataType {
  name: string |null;
  id: string |null;
  description: string |null;
  image: string |null;
}

const myDataContext = createContext<MyDataType | undefined>(undefined);

export const MyDataProvider = ({ children }: any) => {
    const [myData, setMyData] = useState<MyDataType>({
        name: null,
        id: null,
        description: null,
        image:null,
    });
    const { contract ,account} = useEthereum();

    const getInfo = async() => {
        try {
            if (contract && account) {        
                const res = await contract?.profiles(account);
            setMyData(res);
            }
            
        } catch (error) {
            console.log(error)
        }
    }
    
    useEffect(() => {
        getInfo();
    }, [contract, account,myData]);

    return (<>
        <myDataContext.Provider value={myData}>
             {children}
    </myDataContext.Provider>
    </>)
}

export const useMyData = () => {
    const context = useContext(myDataContext);
    if (!context) throw new Error('Plz wrap ur code inside provider');
    return context;
}