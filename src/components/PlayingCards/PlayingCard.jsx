import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis"
import { Image, Spin } from 'antd';
import abis from "../../helpers/contracts";
import { getPlayingCardsAddress } from "../../helpers/networks";
import { svgToImgSrc } from "../../helpers/nft";

export const PlayingCard = ({ cardId, width = 100 }) => {

  const { chainId } = useMoralis();
  const abi = abis.playing_cards;
  const contractAddress = getPlayingCardsAddress(chainId);

  const [cardSvg, setCardSvg] = useState(null);

  const { data, fetch } = useWeb3ExecuteFunction({
    abi,
    contractAddress,
    functionName: "getCardAsSvg",
    params: {
      "cardId": String(cardId),
    },
  });

  useEffect(() => {
    if (!data) {
      fetch()
    } else {
      setCardSvg(data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (!cardSvg) {
    return <Spin className="spin_loader" />;
  }

  return (
    <Image src={svgToImgSrc(cardSvg)} alt={`Card #${cardId}`} width={width} preview={false} />
  );
}
