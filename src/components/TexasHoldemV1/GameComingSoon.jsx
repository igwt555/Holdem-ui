import React from "react";

export default function GameComingSoon({ playOnMobile }) {
  return (
    <div className="play-wrapper">
      <div className="coming-soon--wrapper">
        <p className="title">
          {playOnMobile ? "Play on desktop/laptop" : "Coming Soon!"}
        </p>
        <img src="../../assets/images/cards2.png" alt="" />
      </div>
    </div>
  );
}
