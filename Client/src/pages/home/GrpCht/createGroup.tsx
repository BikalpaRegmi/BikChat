import { SetStateAction, useEffect, useState } from "react";
import Modal from "../../../components/CreateGrpModal";
import { useEthereum } from "../../../contexts/contractContext";
import { useNavigate } from "react-router-dom";
  import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
  
interface Props {
    open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>
  refreshGroup : ()=>void
}

interface DataType {
  name: string | null;
  id: string | null;
  description: string | null;
  image: string | null;
}

const CreateGroup: React.FC<Props> = ({ open, setOpen ,refreshGroup}) => {
    const [contacts, setContacts] = useState<DataType[]>();
    const [toAdd, setToAdd] = useState<string[]>([]);
    const { contract, account } = useEthereum();
    const navigate = useNavigate();

    const getAllContacts = async () => {
      try {
        if (contract) {
            
          const res = await contract?.getAllProfiles();
          const myContacts: DataType[] = [];
          for (const profile of res) {
            const isContact: DataType = await contract?.contacts(account, profile.id);
            if (isContact) myContacts.push(profile);
          }
          setContacts(myContacts);
        }
        } catch (error) {
            console.log(error)
        }
    }

    const selectToAdd = (id: string) => {
        setToAdd((prev:any) => [
            ...prev , id
        ])
}

    const selectToDelete = (id: string) => {
        setToAdd((prev: any) => prev.filter((curval: any) => curval !== id));
    }

    const handleCreate = async () => {
        try {
            if (toAdd.length < 1) {
                toast.error("Group must contain atleast 2 People")
            } else {
                const transaction: any = await contract?.createGroupChat(toAdd, `You and ${toAdd.length} other`, Date.now().toString());
                await transaction.wait();
                toast("Creating group plz wait");
              setOpen(false); 
              refreshGroup();
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllContacts();
    }, [open]);

  return (
    <div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="text-center overflow-scroll w-80 h-96">
          <div className="mx-auto w-full my-4 ">
            <h3 className="text-lg  font-black text-orange-700">
              Create Group Chat
            </h3>
            {contacts?.map((curval: DataType) => {
              return (
                <div key={curval.id} className="main ml-16  mt-3 mx-auto  flex gap-3">
                  <img
                    onClick={() => navigate(`/Profile/${curval.id}`)}
                    src={curval.image!}
                    className="h-9 w-9 rounded-full"
                    alt=""
                  />
                  <b className="mt-1">{curval.name}</b>
                  {!toAdd?.includes(curval.id!) ? (
                    <b
                      className="text-xl bg-yellow-700 text-white cursor-pointer rounded-full w-9 h-7 mt-0.5"
                      onClick={() => selectToAdd(curval.id!)}
                    >
                      +
                    </b>
                  ) : (
                    <b
                      className="text-xl bg-red-700 text-white cursor-pointer rounded-full w-9 h-7 mt-0.5"
                      onClick={() => selectToDelete(curval.id!)}
                    >
                      x
                    </b>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <button
          onClick={handleCreate}
          className="bg-lime-500 font-semibold text-black absolute right-5 text-lg px-3 "
        >
          Create
        </button>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default CreateGroup
