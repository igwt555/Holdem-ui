import React from "react";
import NFT from "./NFT";

export default function NFTList({ currentTokens, mintedTokens }) {

  return (
    <div className="nft_list">
      {currentTokens &&
        currentTokens.map((item) => (
          <NFT key={`nft_id_${item}`} tokenId={item} mintedTokens={mintedTokens} />
        ))}
    </div>
  );
}
