import { useMyData } from "../../contexts/myDataContext"
import MyContacts from "./myContacts"
import NavBar from "../../components/navBar";

const MyProfile = () => {
  const { name, description, image } = useMyData();
  
  return (
    <div>
      <NavBar />
      <section className="mt-10 p-4">
        <div className="w-full md:w-1/2 md:mx-auto flex flex-col md:flex-row items-center justify-center text-center">
          <img
            className="inline-flex cursor-pointer object-cover border-4 border-green-900 rounded-full shadow-[5px_5px_0_0_rgba(0,0,0,1)] shadow-lime-900/100 bg-indigo-50 h-24 w-24  mb-4 md:mb-0 ml-0 md:mr-5"
            src={image!}
            alt=""
          />
          <div className="flex flex-col">
            <div className="md:text-justify mb-3">
              <div className="flex flex-col mb-5">
                <p className="text-lime-300 font-bold text-xl">{name}</p>
              </div>

              <p className="text-green-500 font-semibold text-center md:text-left">
                {description}{" "}
              </p>
            </div>
          </div>
        </div>
      </section>
      <MyContacts />
    </div>
  );
}

export default MyProfile
