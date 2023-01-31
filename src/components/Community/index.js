import "./style.scss";
import {
  DiscordLogo,
  TwitterLogo,
  OpenSeaLogo,
  DocumentationLogo,
  MediumLogo,
} from "./Logos.jsx";
import { useState } from "react";

const menuItems = [
  {
    key: "discord",
    value: "Discord",
    icon: <DiscordLogo />,
    link: "https://discord.gg/dmgga7b72Y",
  },
  {
    key: "twitter",
    value: "Twitter",
    icon: <TwitterLogo />,
    link: "https://twitter.com/holdemheroes",
  },
  {
    key: "opensea",
    value: "OpenSea",
    icon: <OpenSeaLogo />,
    link: "https://opensea.io/collection/holdemheroes",
  },
  {
    key: "blog",
    value: "Blog",
    icon: <MediumLogo />,
    link: "https://medium.com/holdem-heroes",
  },
  {
    key: "documentation",
    value: "Documentation",
    icon: <DocumentationLogo />,
    link: "https://docs.holdemheroes.com/",
  },
];

function Community({ isMobile }) {
  const [show, setShow] = useState(false);

  const dropdownBody = menuItems.map((item) => (
    <li key={item.key} className="dropdown-item">
      <a href={item.link} target="_blank" rel="noreferrer">
        {item.icon}
        <span>{item.value}</span>
      </a>
    </li>
  ));

  if (!isMobile) {
    return (
      <div className="dropdown-wrapper community">
        <button className="dropdown-btn">Community</button>
        <ul className="dropdown-body">{dropdownBody}</ul>
      </div>
    );
  }
  if (isMobile) {
    return (
      <>
        <button className="dropdown-btn--mobile" onClick={() => setShow(!show)}>
          Community
          <div
            className={show ? "arrow-up" : "arrow-down"}
            style={{ marginLeft: "15px" }}
          />
        </button>
        <ul className={`dropdown-body--mobile ${!show ? "hidden" : ""}`}>
          {dropdownBody}
        </ul>
      </>
    );
  }
}

export default Community;
