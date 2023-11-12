import { useEffect } from "react";
import Navbar from "../components/navbar";
import { useSelector } from "react-redux";

const Home = () => {
  const profile = useSelector((state) => state.profile.data);

  return (
    <div>
      <Navbar />
      {profile ? (
        <h1>
          Velkommen, {profile?.first_name} {profile?.last_name}
        </h1>
      ) : (
        <h1>Du er ikke logget inn</h1>
      )}
    </div>
  );
};

export default Home;
