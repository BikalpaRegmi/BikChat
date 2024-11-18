import axios from "axios";
import { useState } from "react";
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
import { useEthereum } from "../../contexts/contractContext";
import { useNavigate } from "react-router-dom";

interface myProfileType {
  name: string | null;
  description: string | null;
  image: string | null;
}

const SignINComponent = () => {
  const [loginDetail, setLoginDetail] = useState<myProfileType>({
    name: null,
    description: null,
    image: null,
  });
  const [file, setFile] = useState<File | null>(null);
  const { contract } = useEthereum();
  const navigate = useNavigate();
  
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setLoginDetail((prev) => ({
      ...prev, [e.target.name]: e.target.value,
    }));
  }
  
  const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  toast("Creating Profile", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
    const fileData: FormData = new FormData();
    if (file!=null) {
      fileData.append('file',file);
    }
    const res:any = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      fileData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: import.meta.env.VITE_Pinata_api_key,
          pinata_secret_api_key: import.meta.env.VITE_Pinata_secret_api_key,
        },
      }
    );
    const imgUrl: string = "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash;
    console.log(imgUrl);

    const updatedDetails = {
      ...loginDetail , image:imgUrl
    }

    const transaction = await contract?.createProfile(
updatedDetails.name , updatedDetails.description, updatedDetails.image
    );

    await transaction.wait();
    navigate('/');
  }

  return (
    <div>
     <h1 className="text-5xl shadow-xl font-bold mb-12 mt-9 text-center drop-shadow-md text-lime-300">BikChat </h1>
    <div className="grid gap-8">
      <div
        id="back-div"
        className="bg-gradient-to-r md:mx-36 from-green-500 to-lime-600 rounded-[26px] m-4 "
      >
        <div
          className="border-[20px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2"
        >
          <h1 className="pt-8 pb-6 font-bold text-5xl dark:text-gray-400 text-center cursor-default">
           Create account
          </h1>
          <form onSubmit={handleSubmit} method="post" className="space-y-4 px-1">
            <div>
              <label  className="mb-2 dark:text-gray-400 text-lg">Name</label>
              <input
                id="name"
                className="border dark:bg-lime-700 dark:text-gray-300 dark:border-gray-700 p-3 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full focus:scale-105 ease-in-out duration-300"
                type="text"
                placeholder="Enter Name"
                  required
                  name="name"
                  onChange={handleChange}
              />
            </div>
            <div>
              <label  className="mb-2 dark:text-gray-400 text-lg">Description</label>
              <input
                id="text"
                className="border dark:bg-lime-700 dark:text-gray-300 dark:border-gray-700 p-3 mb-2 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full focus:scale-105 ease-in-out duration-300"
                type="text"
                placeholder="Enter Description"
                  required
                  onChange={handleChange}
                  name="description"
              />
              </div>
              
            <div>
              <label  className="mb-2 dark:text-gray-400 text-lg">Profile Picture</label>
              <input
                className="border dark:bg-lime-700 dark:text-gray-300 dark:border-gray-700 p-3 mb-2 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full focus:scale-105 ease-in-out duration-300"
                type="file"
                placeholder="Enter Description"
                  required
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFile(e.target.files && e.target.files[0])
                  }}
              />
            </div>
            <button
              className="bg-gradient-to-r from-green-500 to-lime-500 shadow-lg mt-6 p-2 font-bold text-black rounded-lg w-full hover:scale-105 hover:from-red-500 hover:to-lime-500 transition duration-300 ease-in-out"
              type="submit"
            >
Create account
              </button>
          </form>
         
          <div
            className="text-gray-500 flex text-center flex-col mt-4 items-center text-sm"
          >
            <p className="cursor-default">
              By signing in, you agree to our {' '}
              <a
                className="group text-blue-400 transition-all duration-100 ease-in-out"
                
              >
                <span
                  className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                >
                    Terms
                    {' '}
                </span>
              </a>
              and
              <a
                className="group text-blue-400 transition-all duration-100 ease-in-out"
                
              >
                <span
                  className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                >
                { ' '}  Privacy Policy
                </span>
              </a>
            </p>
          </div>
        </div>
      </div>
      </div>
      <ToastContainer/>
          <div />
          </div>
  )
}

export default SignINComponent
