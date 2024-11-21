import { useNavigate } from "react-router-dom"
import NavBar from "../../components/navBar"
import { useEffect, useState } from "react";
import axios from "axios";
import { useEthereum } from "../../contexts/contractContext";

interface EditProfileType {
    name: string | null,
    description: string | null,
    image:string | null,
}

const EditProfile = () => {
    const navigate = useNavigate();
    const [changed, setChanged] = useState<EditProfileType>({
        name: null,
        description: null,
        image:null,
    });
    const [file, setFile] = useState<File | null>(null);
    const { contract,account } = useEthereum();

    const handleChange =  (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setChanged((prev) => ({
            ...prev, [e.target.name]: e.target.value,
        }));
    }

    const getPreviousDetail = async () => {
        const res: any = await contract?.profiles(account);
        const newRes = {
            name: res.name,
            description: res.description,
            image:res.image,
        }
        setChanged(newRes);
    }

    const editProfile = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        let imgUrl = changed.image; // Use the existing image by default

        if (file) {
          // If a new file is uploaded, update the image URL
          const fileData = new FormData();
          fileData.append("file", file);
          const res = await axios.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            fileData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                pinata_api_key: import.meta.env.VITE_Pinata_api_key,
                pinata_secret_api_key: import.meta.env
                  .VITE_Pinata_secret_api_key,
              },
            }
          );
          imgUrl = "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash;
        }

        const updatedData = {
          name: changed.name,
          description: changed.description,
          image: imgUrl,
        };

        const transact = await contract?.editProfile(
          updatedData.name,
          updatedData.description,
          updatedData.image
        );
        await transact.wait();

        navigate("/account");
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    };

    useEffect(() => {
        getPreviousDetail(); 
    },[])
  return (
    <div>
      <NavBar />
      <div className=" rounded-lg shadow relative m-10">
        <div className="flex items-start justify-between p-5 border-b-4 border-lime-500 rounded-t">
          <h3 className="text-xl font-semibold">Edit product</h3>
          <button
            onClick={() => navigate("/account")}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            data-modal-toggle="product-modal"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={editProfile}>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label className="text-sm font-medium text-gray-900 block mb-2">
                  Name
                </label>
                <input
                                  type="text"
                                  onChange = {handleChange}
                  name="name"
                  id="product-name"
                  className="shadow-sm text-white border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  placeholder="Name"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <p className="text-sm font-medium  block mb-2">
                  Image:
                </p>
                <input
                  type="file"
                  name="image"
                  id="category"
                  className="shadow-sm text-white border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                  placeholder="Electronics"
                                  onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setFile(e.target.files && e.target.files[0])}
                />
              </div>

              <div className="col-span-full">
                <label className="text-sm font-medium text-gray-900 block mb-2">
                  Description
                </label>
                <textarea
                  id="product-details"
                                  name="description"
                                  onChange = {handleChange}
                  className="text-white border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-4"
                  placeholder="Description"
                ></textarea>
              </div>
            </div>
        <div className="p-6 border-t border-gray-200 rounded-b">
          <button
            className="text-white bg-lime-600 hover:bg-yellow-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            type="submit"
          >
            Save all
          </button>
        </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default EditProfile
