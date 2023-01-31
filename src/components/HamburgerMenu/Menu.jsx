import { NavLink } from "react-router-dom";
import Community from "../Community";
import Account from "../Account";

const Menu = ({ open, setOpen, isAuthenticated }) => {
  return (
    <div className={`menu ${!open ? "menu--close" : ""}`}>
      <NavLink to="/Marketplace" onClick={() => setOpen(false)}>
        Marketplace
      </NavLink>
      <NavLink to="/NFTwallet" onClick={() => setOpen(false)}>
        NFT Wallet
      </NavLink>
      <NavLink to="/Rules" onClick={() => setOpen(false)}>
        Rules
      </NavLink>
      {isAuthenticated && (
        <NavLink to="/Play" onClick={() => setOpen(false)}>
          Play
        </NavLink>
      )}
      <Community isMobile={true} />
      {!isAuthenticated && <Account />}
    </div>
  );
};

export default Menu;
