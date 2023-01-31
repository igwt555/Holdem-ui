import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import { GameHistoryCompleted } from "./GameHistoryCompleted";
import { GameHistoryRefunded } from "./GameHistoryRefunded";
import { getBakendObjPrefix } from "../../../helpers/networks";

export const GameHistoryContainer = ({ gameId, gamesInProgress }) => {

  const { Moralis, chainId } = useMoralis();
  const backendPrefix = getBakendObjPrefix(chainId);

  const [gameStartedData, setGameStartedData] = useState(null);
  const [gameEndedData, setGameEndedData] = useState(null);
  const [gameStartedDataInitialised, setGameStartedDataInitialised] = useState(false);
  const [gameIsInProgress, setGameIsInProgress] = useState(false);

  const [gameIsFinished, setGameIsFinished] = useState(null);
  const [gameIsFinishedLoading, setGameIsFinishedLoading] = useState(false);
  const [gameIsFinishedFetched, setGameIsFinishedFetched] = useState(false);

  const [gameIsRefunded, setGameIsRefunded] = useState(null);
  const [gameIsRefundedLoading, setGameIsRefundedLoading] = useState(false);
  const [gameIsRefundedFetched, setGameIsRefundedFetched] = useState(false);

  function fetchGameIsFinished() {
    setGameIsFinishedLoading(true);
    // get any hands already played
    const THWinningsCalculated = Moralis.Object.extend(`${backendPrefix}THWinningsCalculated`);
    const queryTHWinningsCalculated = new Moralis.Query(THWinningsCalculated);
    queryTHWinningsCalculated
      .equalTo("gameId", String(gameId));
    queryTHWinningsCalculated.find()
      .then((result) => {
        setGameIsFinishedFetched(true);
        if (result.length > 0) {
          setGameIsFinished(true);
          const d = {
            txHash: result[0].get("transaction_hash"),
            timestamp: result[0].get("block_timestamp"),
          };
          setGameEndedData(d);
        } else {
          setGameIsFinished(false);
        }
      })
      .catch((e) => console.log(e.message));
  }

  function fetchGameIsRefunded() {
    setGameIsRefundedLoading(true);
    // get any hands already played
    const THRefundableGame = Moralis.Object.extend(`${backendPrefix}THRefundableGame`);
    const queryTHRefundableGame = new Moralis.Query(THRefundableGame);
    queryTHRefundableGame
      .equalTo("gameId", String(gameId));
    queryTHRefundableGame.find()
      .then((result) => {
        setGameIsRefundedFetched(true);
        if (result.length > 0) {
          setGameIsRefunded(true);
          const d = {
            txHash: result[0].get("transaction_hash"),
            timestamp: result[0].get("block_timestamp"),
          };
          setGameEndedData(d);
        } else {
          setGameIsRefunded(false);
        }
      })
      .catch((e) => console.log(e.message));
  }

  useState(() => {
    async function getGameStartedData() {
      const THGameStarted = Moralis.Object.extend(`${backendPrefix}THGameStarted`);
      const query = new Moralis.Query(THGameStarted);
      query
        .equalTo("gameId", String(gameId));

      query.first()
        .then((result) => {
          if (result) {
            const d = {
              round1Price: result.get("round1Price"),
              round2Price: result.get("round2Price"),
              txHash: result.get("transaction_hash"),
              timestamp: result.get("block_timestamp"),
            };
            setGameStartedData(d);
          }
        })
        .catch((e) => console.log(e.message));
    }

    if (!gameStartedDataInitialised) {
      setGameStartedDataInitialised(true);
      getGameStartedData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, gameStartedDataInitialised]);

  // check if it is a completed game.
  useEffect(() => {
    if (gameIsFinished === null && !gameIsFinishedLoading && !gameIsFinishedFetched) {
      fetchGameIsFinished();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, gameIsFinished, gameIsFinishedLoading, gameIsFinishedFetched]);

  // check if it's refunded
  useEffect(() => {
    if (gameIsFinished === true && gameIsRefunded === null && !gameIsRefundedLoading && !gameIsRefundedFetched) {
      setGameIsRefunded(false);
      setGameIsRefundedLoading(true);
      setGameIsRefundedFetched(true);
    }
    if (gameIsFinished === false && gameIsRefunded === null && !gameIsRefundedLoading && !gameIsRefundedFetched) {
      fetchGameIsRefunded();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, gameIsFinished, gameIsRefunded, gameIsRefundedLoading, gameIsRefundedFetched]);

  // check if it's in progress
  useEffect(() => {
    if(gameId && gamesInProgress) {
      for(let i = 0; i <= gamesInProgress.length; i += 1) {
        if(gamesInProgress[i]?.toString() === String(gameId)) {
          setGameIsInProgress(true);
        }
      }
    }
  }, [gameId, gamesInProgress]);

  if (gameIsFinished === null || gameIsRefunded === null) {
    return <Spin className="spin_loader" />;
  }

  // check if it's in progress
  if (gameIsInProgress) {
    return (
      <div className="game_history_main_body">
        <p className="desc">Game #{gameId?.toString()} has not yet ended. Historical data will be displayed once it has ended.</p>
      </div>
    );
  }

  return (
    <div className="game_history_main_body">
      {
        gameIsFinished && gameStartedData !== null && gameEndedData !== null &&
        <GameHistoryCompleted
          gameId={gameId}
          gameStartedData={gameStartedData}
          gameEndedData={gameEndedData}
        />
      }
      {
        gameIsRefunded && gameStartedData !== null && gameEndedData !== null &&
        <GameHistoryRefunded
          gameId={gameId}
          gameStartedData={gameStartedData}
          gameEndedData={gameEndedData}
        />
      }
      {
        !gameIsFinished && !gameIsRefunded && <p className="desc">No players entered this game</p>
      }
    </div>
  );
}
