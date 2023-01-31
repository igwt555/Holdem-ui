import React from "react";

const Burger = ({ open, setOpen }) => {
  return (
    <div
      className={`burger ${open ? "burger--open" : ""}`}
      onClick={() => setOpen(!open)}
    >
      <div />
      <div />
      <div />
    </div>
  );
};

export default Burger;
