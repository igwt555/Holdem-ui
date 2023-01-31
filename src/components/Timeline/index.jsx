import React from "react";
import "./style.scss";

export default function Timeline() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();

  return (
    <div className="timeline-wrapper">
      <ul className="timeline" id="timeline">
        <li
          className={`li ${
            y === 2022 && m === 3 && d >= 20 && d < 23 ? "complete" : ""
          }`}
        >
          <div className="timestamp">
            <p className="date">Apr 20</p>
            <p className="title">
              NFT Minting
              <br />
              on Ethereum
            </p>
          </div>
        </li>
        <li
          className={`li ${
            y === 2022 && m === 3 && d >= 23 && d < 26 ? "complete" : ""
          }`}
        >
          <div className="timestamp">
            <p className="date">Apr 23</p>
            <p className="title">
              Card Reveal +<br />
              Polygon Card Airdrop
            </p>
          </div>
        </li>
        <li className={`li ${y === 2022 && m === 3 && d >= 26 ? "complete" : ""}`}>
          <div className="timestamp">
            <p className="date">Apr 26</p>
            <p className="title">
              Poker Games Live <br />
              on both chains
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
}
