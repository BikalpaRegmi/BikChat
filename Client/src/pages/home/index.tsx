import { useState } from "react";
import GroupChat from "./GrpCht";
import IndPage from "./IndCht";
import NavBar from "../../components/navBar";

const Home = () => {
  const [isGrp, setIsGrp] = useState<boolean>(false);

  return (
    <div>
      <NavBar />

      {isGrp ? <GroupChat setIsGrp={setIsGrp} /> : <IndPage setIsGrp={setIsGrp } />}
    </div>
  );
};

export default Home;
