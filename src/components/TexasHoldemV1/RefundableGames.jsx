import React, { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { Spin } from "antd";
import { getBakendObjPrefix } from "../../helpers/networks"
import Refundable from "./Refundable";
import "./style.scss";

export default function RefundableGames() {
  const { Moralis, isInitialized, chainId, account } = useMoralis();
  const backendPrefix = getBakendObjPrefix(chainId);

  const [refundableGames, setRefundableGames] = useState(null);
  const [initialDataFetched, setInitialDataFetched] = useState(false);

  useEffect(() => {
    async function fetchRefundableGames() {
      if (!isInitialized || !backendPrefix || !account) {
        return;
      }

      const params =  { player: account, prefix: backendPrefix };
      const refunds = await Moralis.Cloud.run("getUserRefunds", params);

      const rs = []

      for(let i = 0; i < refunds.length; i += 1) {
        rs.push(
          {
            gameId: refunds[i].objectId,
            amount: refunds[i].total,
          }
        )
      }

      rs.sort((a, b) => +b.gameId - +a.gameId);

      setRefundableGames(rs);
      setInitialDataFetched(true);
    }

    if (!initialDataFetched) {
      fetchRefundableGames();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refundableGames, initialDataFetched, isInitialized, backendPrefix, account]);

  if (!initialDataFetched) {
    return <Spin className="spin_loader" />;
  }

  return (
    <div className="refundable_wrapper">
      <p className="title">Refundable Games</p>
      <p className="desc">{Array.isArray(refundableGames) && refundableGames.length ? "Collect Refunds" : "No Refunds to collect at this time"}</p>
      <div className="refundable_games">
        {refundableGames &&
          refundableGames.map((item) => (
            <Refundable gameId={item.gameId} amount={item.amount} key={`refundable_game_${item.gameId}`} />
          ))
        }
      </div>
    </div>
  );
}
