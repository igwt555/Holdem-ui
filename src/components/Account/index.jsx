import { useMoralis } from "react-moralis";
import './style.scss';

function Account() {
  const { authenticate } = useMoralis();

  return (
    <button className={`btn-connect-wallet btn--shadow`} onClick={() => authenticate({ signingMessage: "HoldemHeroes!" })}>
      Connect Wallet
    </button>
  );
}

export default Account;
