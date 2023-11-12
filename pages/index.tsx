import { useAuth } from "../lib/hooks/useAuth";
import Navbar from "../components/navbar";

const Home = () => {
  const { profile, status } = useAuth();

  return (
    <div>
      <Navbar />
      {profile ? (
        <h1>
          Velkommen, {profile.first_name} {profile.last_name}
        </h1>
      ) : (
        <h1>Du er ikke logget inn</h1>
      )}
      <h2>Status: {status}</h2>
    </div>
  );
};

export default Home;
