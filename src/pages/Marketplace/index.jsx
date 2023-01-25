import React from "react";
import "./style.scss";
import { useMoralis } from "react-moralis"
import L1Marketplace from "./L1Marketplace"


export default function Marketplace() {

  const { chainId } = useMoralis();

  if(!chainId) {
    return (
      <div className="marketplace_page-wrapper">
        <p className="title">NFT Marketplace</p>
        <p className="desc">Connect Wallet</p>
      </div>
    )
  }

  return (
    <div className="marketplace_page-wrapper">
      <p className="title">NFT Marketplace</p>
      <L1Marketplace />
    </div>
  )
}
