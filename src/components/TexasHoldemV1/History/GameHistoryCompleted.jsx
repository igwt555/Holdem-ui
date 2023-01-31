import { Leaderboard } from "../Leaderboard";
import React from "react";
import { GameHistoryHandsPlayed } from "./GameHistoryHandsPlayed";
import Moment from "react-moment";
import { getExplorer } from "../../../helpers/networks";
import { getEllipsisTxt } from "../../../helpers/formatters";
import { useMoralis } from "react-moralis";

export const GameHistoryCompleted = ({ gameId, gameStartedData, gameEndedData }) => {

  const { chainId } = useMoralis();

  return (
    <div>
      <div>
        <p className="subtitle">Final Hands and Leaderboard</p>
        <Leaderboard gameId={gameId} showWinnings={true} />
      </div>

      <GameHistoryHandsPlayed
        gameId={gameId}
        round1Price={gameStartedData.round1Price}
        round2Price={gameStartedData.round2Price}
        finished={true}
      />

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
        This game ended and the winnings paid out on{" "}
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
