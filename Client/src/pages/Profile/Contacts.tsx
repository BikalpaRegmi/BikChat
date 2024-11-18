import { useEffect, useState } from "react";
import { IoPersonRemove } from "react-icons/io5";
import { useEthereum } from "../../contexts/contractContext";
import { useParams } from "react-router-dom";

interface DataType {
  name: string | null;
  id: string | null;
  description: string | null;
  image: string | null;
}

const Contacts = () => {
  const [datas, setDatas] = useState<DataType[]>();
  const { contract } = useEthereum();
  const { id } = useParams();

  const getContacts = async () => {
    try {
      const res = await contract?.getAllProfiles();
      const myContacts = res.filter(async (curval: any) => await contract?.contacts(id, curval.id));
      setDatas(myContacts);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getContacts();
  }, []);
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
            <div className="flex flex-wrap -m-2">
              <div className="p-2 lg:w-1/3 md:w-1/2 w-full">
                <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
                  <img
                    alt="team"
                    className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
                    src="https://dummyimage.com/80x80"
                  />
                  <div className="flex-grow">
                    <h2 className="text-yellow-300 flex gap-5  title-font font-medium">
                      Holden Caulfield{" "}
                      <IoPersonRemove className=" cursor-pointer text-red-500 hover:text-[23px] text-xl" />
                    </h2>
                    <p className="text-yellow-500">
                      Lorem ipsum dolor sit amet ...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Contacts
