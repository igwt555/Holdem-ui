import React from "react";
import { useMyNFTHands } from "../../hooks/useMyNFTHands";
import NFTCard from "../NFTCard";
import "./style.scss";
import { Spin } from "antd";
import { NavLink } from "react-router-dom";
import { useMoralis } from "react-moralis"

export default function NFTBalance() {
  const { NFTHands, isLoading } = useMyNFTHands();
  const { chainId } = useMoralis();

  if (isLoading) {
    return <Spin className="spin_loader" />;
  }

  if (!NFTHands.length || !NFTHands) {
    return (
      <div className="no_nfts-body">
        <p className="title">You don't have any Holdem Heroes NFTs yet.</p>
        <div className="btn-wrapper">
          <NavLink to="/Marketplace" className="mint_now_btn btn--shadow">Mint now</NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet_page-wrapper">
      <div className="wallet-header">
        <p className="title">My NFTs</p>
        <p className="desc">These are the Holdem Heroes NFTs in your wallet.<br />You can <NavLink to="/Play">play</NavLink> Holdem Heroes with these, or trade them on OpenSea.</p>
      </div>

      <div className="wallet-main">
        {
          NFTHands && NFTHands.map((nft, index) => {
            return (
              <NFTCard nft={nft} chainId={chainId} key={index} />
            )
          })
        }
      </div>
    </div>
  );
}
