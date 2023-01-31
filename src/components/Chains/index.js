import { useEffect, useState } from "react";
import useChain from "../../hooks/useChain";
import { ETHLogo, PolygonLogo } from "./Logos";
import "./style.scss";
import { useMoralis } from "react-moralis"
import { openNotification } from "../../helpers/notifications"

const CHAINS_IN_USE = process.env.REACT_APP_CHAINS_IN_USE || "0x1";

const chainsInUse = CHAINS_IN_USE.split(",")

const menuItems = [
  {
    key: "0x1",
    value: "Mainnet",
    icon: <ETHLogo size="S" />,
    iconL: <ETHLogo size="L" />,
  },
  {
    key: "0x4",
    value: "Rinkeby",
    icon: <ETHLogo size="S" />,
    iconL: <ETHLogo size="L" />,
  },
  {
    key: "0x89",
    value: "Polygon",
    icon: <PolygonLogo />,
    iconL: <PolygonLogo />,
  },
  {
    key: "0x13881",
    value: "Polygon Mumbai",
    icon: <PolygonLogo />,
    iconL: <PolygonLogo />,
  },
];

function Chains() {
  const { switchNetwork } = useChain();
  const { chainId } = useMoralis();
  const [selected, setSelected] = useState({});

  useEffect(() => {
    if (!chainId) return null;
    const newSelected = menuItems.find((item) => item.key === chainId);
    if(newSelected === undefined) {
      openNotification({
        message: "Warning",
        description: "Please connect to a supported network",
        type: "warn",
      });
    }
    setSelected(newSelected);
  }, [chainId]);

  const handleMenuClick = (e) => {
    switchNetwork(e.target.closest("li").getAttribute("chain_key"));
  };

  return (
    <div className="dropdown-wrapper select_chain">
      <button className="dropdown-btn">{selected?.iconL}</button>
      <ul className="dropdown-body" onClick={handleMenuClick}>
        {
          menuItems.map((item) => ( chainsInUse.includes(item.key) &&
            <li key={item.key} className="dropdown-item" chain_key={item.key}>
              {item.icon}
              <span>{item.value}</span>
            </li>
          ))
        }
      </ul>
    </div>
  );
}

export default Chains;
