import Left from "./Left";
import Right from "./Right";

interface Props {
  setIsGrp: React.Dispatch<React.SetStateAction<boolean>>;
}

const IndPage:React.FC<Props> = ({setIsGrp}) => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 ">
        <Left setIsGrp={setIsGrp} />
        <Right />
      </div>
    </div>
  );
};

export default IndPage;
