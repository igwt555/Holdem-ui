import { useMoralis } from "react-moralis";
import './style.scss';

function Logout() {
  const { logout } = useMoralis();

  return (
    <button className="btn--hover-pointer" onClick={() => { logout(); }} style={{ display: "block", width: "100%", textAlign: "left" }}>
      Disconnect
    </button>
  );
}

export default Logout;
