
interface Props{
setIsGrp:React.Dispatch<React.SetStateAction<boolean>>
}

const LeftGC:React.FC<Props> = ({setIsGrp}) => {

  return (
    <div>
      <div>
        <div className=" bg-slate-900  neo-shadow p-6">
          <ul className="flex justify-around pb-3 font-bold bg-slate-900">
            <li
              onClick={() => setIsGrp(false)}
              className="bg-slate-900 hover:underline cursor-pointer"
            >
              Individual
            </li>
            <li
              onClick={() => setIsGrp(true)}
              className="bg-slate-900 hover:underline cursor-pointer"
            >
              Group
            </li>
          </ul>
          <input
            type="text"
            placeholder="Search"
            className="bg-slate-700 pl-3 rounded-3xl mb-2 w-full h-9"
          />
          <p className="text-5xl ml-auto mr-3 w-12 pb-1 rounded-full px-2">+</p>
          <div className="space-y-4 h-[455px] overflow-scroll">
            <div className="flex cursor-pointer hover:border-2 border-lime-600 items-center space-x-4 p-4 rounded-lg neo-shadow">
              <div className="w-12 h-12  rounded-full neo-inset flex items-center justify-center">
                <img alt="" className="rounded-full" />
              </div>
              <div>
                <h2 className="font-semibold">Name</h2>
                <p className="text-sm text-gray-600">LatestMessage</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftGC
