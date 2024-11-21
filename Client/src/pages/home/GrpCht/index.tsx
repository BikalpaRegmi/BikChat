import LeftGC from "./LeftGc";
import RightGc from "./RightGc";

interface Props{
  setIsGrp : React.Dispatch<React.SetStateAction<boolean>>
}

const GroupChat:React.FC<Props> = ({setIsGrp}) => {

  return (
    <>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 ">

      <LeftGC setIsGrp={ setIsGrp } />
        <RightGc />
        </div>
    </>
  );
};

export default GroupChat;
