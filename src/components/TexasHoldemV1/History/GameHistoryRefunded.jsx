import React from "react";
import { GameHistoryHandsPlayed } from "./GameHistoryHandsPlayed";
import { GameHistoryProcessedRefunds } from "./GameHistoryProcessedRefunds";
import Moment from "react-moment";
import { getExplorer } from "../../../helpers/networks";
import { getEllipsisTxt } from "../../../helpers/formatters";
import { useMoralis } from "react-moralis";

export const GameHistoryRefunded = ({ gameId, gameStartedData, gameEndedData }) => {
  const { chainId } = useMoralis();

  return (
    <div>
      <GameHistoryHandsPlayed gameId={gameId} round1Price={gameStartedData.round1Price} round2Price={gameStartedData.round2Price} />

      <GameHistoryProcessedRefunds gameId={gameId} />

      <p className="desc" style={{marginTop: "44px"}}>
        This game started on{" "}
        <Moment format="YYYY/MM/DD HH:mm:ss">{gameStartedData.timestamp.toString()}</Moment> in
        Tx <a
          href={`${getExplorer(chainId)}/tx/${gameStartedData.txHash}`}
          target={"_blank"}
          rel={"noreferrer"}>
          {getEllipsisTxt(gameStartedData.txHash, 8)}
        </a>.
      </p>

      <p className="desc">
        This game did not finish and entered a refundable state on{" "}
        <Moment format="YYYY/MM/DD HH:mm:ss">{gameEndedData.timestamp.toString()}</Moment> in
        Tx <a
          href={`${getExplorer(chainId)}/tx/${gameEndedData.txHash}`}
          target={"_blank"}
          rel={"noreferrer"}>
          {getEllipsisTxt(gameEndedData.txHash, 8)}
        </a>.
      </p>
    </div>
  );
}
