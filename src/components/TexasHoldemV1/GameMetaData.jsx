import React from "react";
import { useMoralis } from "react-moralis";
import Countdown from "react-countdown";
import { getDealRequestedText, getRoundStatusText } from "../../helpers/formatters";
import { BigNumber } from "@ethersproject/bignumber"

export const GameMetaData = ({ gameId, gameData, feesPaid, playersPerRound, numFinalHands, numHands, gameHasEnded, countdown = false }) => {

  const { Moralis } = useMoralis();

  const myTotalBet = () => {
    const bet = BigNumber.from(feesPaid[2]?.me || "0").add(BigNumber.from(feesPaid[4]?.me || "0"));
    return Moralis.Units.FromWei(bet.toString(), 18);
  }

  const totalPot = () => {
    const bet = BigNumber.from(feesPaid[2]?.total || "0").add(BigNumber.from(feesPaid[4]?.total || "0"));
    return Moralis.Units.FromWei(bet.toString(), 18);
  }

  const columns_r = [
    {
      title: "",
      dataIndex: "item",
      key: "item",
    },
    {
      title: "Flop",
      dataIndex: "flop",
      key: "flop",
    },
    {
      title: "Turn",
      dataIndex: "turn",
      key: "turn",
    },
    {
      title: "River",
      dataIndex: "river",
      key: "river",
    },
    {
      title: "Totals",
      dataIndex: "totals",
      key: "totals",
    },
  ];

  const dataSource_r = [
    {
      key: "My Bet",
      item: "My Bet",
      flop: Moralis.Units.FromWei(feesPaid[2].me, 18),
      turn: Moralis.Units.FromWei(feesPaid[4].me, 18),
      river: gameData?.status === 6 ? myTotalBet() : "0",
      totals: myTotalBet(),
    },
    {
      key: "Players",
      item: "Players",
      flop: playersPerRound[2].length,
      turn: playersPerRound[4].length,
      river: numFinalHands,
      totals: numFinalHands,
    },
    {
      key: "Hands",
      item: "Hands",
      flop: numHands[2],
      turn: numHands[4],
      river: numFinalHands,
      totals: numFinalHands,
    },
    {
      key: "Total Bet",
      item: "Total Bet",
      flop: Moralis.Units.FromWei(feesPaid[2].total, 18),
      turn: Moralis.Units.FromWei(feesPaid[4].total, 18),
      river: gameData?.status === 6 ? totalPot() : "0",
      totals: totalPot(),
    },
  ];

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return null;
    } else {
      // Render a countdown
      return (
        <div className="countdown">
          <div>
            <div>{hours < 10 ? "0" + hours : hours}</div>
            <div>hrs</div>
          </div>
          <div>
            <div>{minutes < 10 ? "0" + minutes : minutes}</div>
            <div>min</div>
          </div>
          <div>
            <div>{seconds < 10 ? "0" + seconds : seconds}</div>
            <div>sec</div>
          </div>
        </div>
      );
    }
  };

  if (countdown) {
    return (
      <div>
        {
          (gameData.status === 1 || gameData.status === 3 || gameData.status === 5) && gameData.gameStartTime > 0 && <div className="dealt_in_time">
            <div>{getRoundStatusText(gameData.status)}</div>
            <>
              {
                gameData.status === 1 && <Countdown date={(gameData.gameStartTime * 1000) + 200000} renderer={renderer} />
              }
              {
                gameData.status === 3 && <Countdown date={(gameData.roundEndTime * 1000) + 200000} renderer={renderer} />
              }
              {
                gameData.status === 5 && <Countdown date={(gameData.roundEndTime * 1000) + 200000} renderer={renderer} />
              }
            </>
          </div>
        }
        {
          (gameData.status === 2 || gameData.status === 4 || gameData.status === 6) && !gameHasEnded &&
          <div className="end_in_time">
            <div>{(gameData.status === 2 || gameData.status === 4) && `${getDealRequestedText(gameData.status)} ends in:`}</div>
            <Countdown date={(gameData.roundEndTime * 1000)} renderer={renderer} />
          </div>
        }
      </div>
    )
  }

  return (
    <>
      <div className="bet_price-info">
        <p style={{ color: "white" }}>{`Round Time: ${gameData.gameRoundTimeSeconds / 60} Minutes`}</p>
        <p style={{ color: "white" }}>{`Flop Bet Per NFT: ${Moralis.Units.FromWei(gameData.round1Price, 18)}`}</p>
        <p style={{ color: "white" }}>{`Turn Bet Per NFT: ${Moralis.Units.FromWei(gameData.round2Price, 18)}`}</p>
      </div>

      <div className="game_info-table--wrapper">
        <table className="game_info-table">
          <thead>
            <tr>
              {columns_r.map((item) => (
                <td key={item.key}>{item.title}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataSource_r.map((item) => {
              return (
                <tr key={item.key}>
                  <td>{item.item}</td>
                  <td>{item.flop}</td>
                  <td>{item.turn}</td>
                  <td>{item.river}</td>
                  <td>{item.totals}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
