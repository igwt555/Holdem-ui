import React from "react";
import "./style.scss";

export default function NFTMeta({ metadata }) {

  const traits = [];
  for (let i = 0; i < metadata.attributes.length; i++) {
    const attr = metadata.attributes[i];
    traits.push(<li key={`nft_meta${i}_${attr.trait_type}`}>{attr.trait_type}: <strong>{attr.value}</strong></li>);
  }

  const attributes = <ul>{traits}</ul>;

  return (
    <div className="nft_meta">
      {attributes}
    </div>
  );
}