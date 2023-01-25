import React, { useEffect, useState } from "react";
import { useNFTSaleInfo } from "../../hooks/useNFTSaleInfo"
import { useMoralis, useMoralisQuery } from "react-moralis"
import { getBakendObjPrefix } from "../../helpers/networks"
import { MAX_TOTAL_SUPPLY } from "../../helpers/constant"
import { Spin } from "antd"
import Countdown from "react-countdown"
import { largeTextRenderer } from "../../helpers/timers"
import PostRevealSale from "../../components/Sale/PostRevealSale"

export default function L1Marketplace() {
  const {
    startingIndex,
    revealTime,
    startingIndexFetch,
  } = useNFTSaleInfo();

  const { chainId } = useMoralis();

  const [backendPrefix, setBackendPrefix] = useState(null);
  const [minted, setMinted] = useState([]);
  const [revealTimeDiff, setRevealTimeDiff] = useState(null);

  useEffect(() => {
    if(chainId) {
      setBackendPrefix(getBakendObjPrefix(chainId))
    }
  }, [chainId]);

  useEffect(() => {
    if(revealTime && revealTime > 0) {
      const now = Math.floor(Date.now() / 1000);
      setRevealTimeDiff(revealTime - now);
    }
  }, [revealTime]);

  const { data: mintedRes } = useMoralisQuery(
    `${backendPrefix}HEHTransfer`,
    (query) =>
      query
        .equalTo("from", "0x0000000000000000000000000000000000000000")
        .equalTo("confirmed", true)
        .limit(MAX_TOTAL_SUPPLY),
    [backendPrefix],
    {
      live: true,
    }
  );

  useEffect(() => {
    if (mintedRes) {
      let m = mintedRes.map((item, i) => parseInt(item.get("tokenId"), 10));
      setMinted(m);
    }
  }, [mintedRes]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      startingIndexFetch()
    }, 10000);

    return () => {
      clearTimeout(timeout);
    };
  });

  if (
    chainId === null ||
    backendPrefix === null ||
    startingIndex === null ||
    revealTime === null
  ) {
    return <Spin className="spin_loader" />;
  }

  return (
    <>
      {
        revealTimeDiff > 0 ? (
          <>
            <div className="sale_info">
              <p className="desc">NFT Distribution and Reveal in</p>
              <div>
                <Countdown date={revealTime * 1000} renderer={largeTextRenderer} />
              </div>
            </div>
          </>
        ) : startingIndex.toNumber() === 0 ? (
          <p className="desc">Waiting for Reveal & Distribution</p>
        ) : (
          <PostRevealSale
            mintedTokens={minted}
            l1={true}
          />
        )
      }
    </>
  )
}
