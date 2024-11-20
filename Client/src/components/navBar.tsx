import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const navigate = useNavigate();
  return (
    <div>
      <div className="w-full z-50 mb-3  border-b backdrop-blur-lg bg-opacity-80">
        <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8 ">
          <div className="relative flex h-16 justify-between">
            <div className="flex flex-1 items-stretch justify-start">
              <b
                onClick={() => navigate("/")}
                className="flex text-green-500 flex-shrink-0 text-5xl cursor-pointer items-center"
              >
                Bik <span className="text-lime-500">Chat</span>
              </b>
            </div>
            <div className="flex-shrink-0 flex px-2 py-3 items-center gap-2 md:space-x-8">
              <a
                className=" hover:text-indigo-700 px-1 md:px-5 cursor-pointer text-black py-2 rounded-md bg-sky-300 md:text-md font-medium"
                onClick={() => navigate("/contacts")}
              >
                Add Contacts
              </a>
              <a
                className="text-gray-800 cursor-pointer bg-indigo-100 hover:bg-indigo-200 inline-flex items-center justify-center px-3 py-2 border border-transparent text-md font-medium rounded-md shadow-sm "
                onClick={() => navigate("/account")}
              >
                Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar
