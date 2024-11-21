import { useEffect, useState } from "react";
import { useEthereum } from "../../contexts/contractContext";
import { useNavigate, useParams } from "react-router-dom";

interface DataType {
  name: string | null;
  id: string | null;
  description: string | null;
  image: string | null;
}

const Contacts = () => {
  const [datas, setDatas] = useState<DataType[]>();
  const { contract,account } = useEthereum();
  const { id } = useParams();
  const navigate = useNavigate();

  const getContacts = async () => {
    try {
      const res = await contract?.getAllProfiles();

      const contacts: DataType[] = [];

      for (const profile of res) {
        const isContact: boolean = await contract?.contacts(id, profile.id);
        if (isContact) contacts.push(profile);
      }
      setDatas(contacts);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getContacts();
  }, [id]);
  return (
    <div>
      <div>
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-col text-center w-full mb-20">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-green-300">
                Contacts
              </h1>
            </div>
            {datas?.map((curval: DataType) => {
              return (
                <div className="flex flex-wrap -m-2">
                  <div className="p-2 lg:w-1/3 md:w-1/2 w-full">
                    <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
                      
                      <img
                        alt="team"
                        className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
                        src={curval.image!}
                        onClick={() => {account?.toLowerCase()!=curval.id?.toLowerCase() ? navigate(`/Profile/${curval.id}`) :navigate('/account') } }
                        />
                        
                      <div className="flex-grow">
                        <h2 className="text-yellow-300 flex gap-5  title-font font-medium">
                         {curval.name}
                        </h2>
                        <p className="text-yellow-500">
                          {curval.description?.slice(0,16)}...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Contacts
