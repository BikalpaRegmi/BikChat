import { IoPersonAddSharp } from "react-icons/io5";
import { useEthereum } from "../../contexts/contractContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface MyDataType {
  name: string | null;
  id: string | null;
  description: string | null;
  image: string | null;
}

const MyContacts = () => {
  const { contract, account } = useEthereum();
  const [allUsers, setAllUsers] = useState<MyDataType[]>();
  const [search, setSearch] = useState<string>();
  const navigate = useNavigate();

  const getAllUsers = async() => {
    try {
      const res = await contract?.getAllProfiles();
      const newRes = res.filter((curval: any) => curval.id.toLowerCase() !== account?.toLowerCase());
      if (search != undefined && search.length > 1) {
        const dataAfterSearch = newRes.filter((curval: any) => curval.name.toLowerCase().includes(search.toLowerCase()));

        const notAdded: MyDataType[] = [];

        for (const profile of dataAfterSearch){
          const isContact = await contract?.contacts(account, profile.id);
          if (!isContact) notAdded.push(profile);
        }
        setAllUsers(notAdded);
      } else {
        const notAdded: MyDataType[] = [];

        for (const profile of newRes) {
          const isContact = await contract?.contacts(account, profile.id);
          if(!isContact) notAdded.push(profile);
        }
        setAllUsers(notAdded);
      }

    } catch (error) {
      console.log(error);
    }
  }

  const handleAddToContact = async (id:string) => {
    try {
      await contract?.addToContact(id);
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getAllUsers();
  }, [contract, account , search]);

 

  return (
    <div>
      <div id="search-bar" className="w-120 bg-white rounded-md shadow-lg z-10">
        <form className="flex items-center justify-end p-2 pr-3">
          <input
            type="text"
            placeholder="Search here"
            onChange={((e:React.ChangeEvent<HTMLInputElement>)=>setSearch(e.target.value))}
            className="w-64 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-green-700 text-white rounded-md px-4 py-1 ml-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
          >
            Search
          </button>
        </form>
      </div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-left w-full mb-9">
            <h1 className="sm:text-3xl text-2xl font-medium title-font text-green-500">
              Add Members
            </h1>
          </div>
          {allUsers?.map((curval) => {
            return (
              <div key={curval.id} className="flex flex-wrap -m-2">
                <div className="p-2 lg:w-1/3 md:w-1/2 w-full">
                  <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
                    <img
                      alt="team"
                      className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
                      src={curval.image!}
                      onClick={()=>navigate(`/Profile/${curval.id}`)}
                    />
                    <div className="flex-grow">
                      <h2 className="text-yellow-300 flex gap-5 title-font font-medium">
                        {curval.name }{" "}
                        <IoPersonAddSharp onClick={()=>handleAddToContact(curval.id!)} className=" cursor-pointer hover:text-[23px] text-xl" />
                      </h2>
                      <p className="text-yellow-500">
                        {`${curval.description?.slice(0, 16)}...`} <u className="cursor-pointer" onClick={()=>navigate(`/Profile/${curval.id}`)}>view more </u>
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
  );
};

export default MyContacts;
