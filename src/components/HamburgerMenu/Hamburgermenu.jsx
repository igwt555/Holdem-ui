import { useState, useRef } from "react";
import Burger from "./Burger";
import Menu from "./Menu";
import "./style.scss";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

const HamburgerMenu = ({ isAuthenticated }) => {
  const [open, setOpen] = useState(false);
  const node = useRef();
  useOnClickOutside(node, () => setOpen(false));

  return (
    <div ref={node} className="hamburger-menu">
      <Burger open={open} setOpen={setOpen} />
      <Menu open={open} setOpen={setOpen} isAuthenticated={isAuthenticated} />
    </div>
  );
};

export default HamburgerMenu;
