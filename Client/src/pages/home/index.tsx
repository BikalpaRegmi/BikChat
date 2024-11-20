import NavBar from "../../components/navBar";
import Left from "./Left";
import Right from "./Right";

const HomePage = () => {
  return (
    <div>
      <NavBar />
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 ">
      <Left/>
      <Right/>
      </div>
    </div>
  );
}

export default HomePage
