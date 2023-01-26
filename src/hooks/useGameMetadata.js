import { useEffect, useState } from "react";
import { useMoralis, useMoralisSubscription } from "react-moralis";
import abis from "../helpers/contracts";
import { getTexasHoldemV1Address } from "../helpers/networks";
import { openNotification } from "../helpers/notifications";

export const useGameMetadata = (backendPrefix) => {
  const { Moralis, chainId, isWeb3EnableLoading } = useMoralis();

  const abi = abis.texas_holdem_v1;

  const [options, setOptions] = useState(null);
  const [contractAddress, setContractAddress] = useState(getTexasHoldemV1Address(chainId));

  const [maxConcurrentGames, setMaxConcurrentGames] = useState(null);
  const [maxConcurrentGamesLoading, setMaxConcurrentGamesLoading] = useState(false);
  const [maxConcurrentGamesFetched, setMaxConcurrentGamesFetched] = useState(false);

  const [gamesInProgress, setGamesInProgress] = useState([]);
  const [gamesInProgressLoading, setGamesInProgressLoading] = useState(false);
  const [gamesInProgressFetched, setGamesInProgressFetched] = useState(false);

  const [numGames, setNumGames] = useState(0);
  const [numGamesLoading, setNumGamesLoading] = useState(false);
  const [numGamesFetched, setNumGamesFetched] = useState(false);

  function handleOnChainMaxConcurrentGames(result) {
    setMaxConcurrentGamesFetched(true);
    setMaxConcurrentGames(result);
  }

  function handleOnChainGamesInProgress(result) {
    setGamesInProgressFetched(true);
    setGamesInProgress(result);
  }

  function handleOnChainNumGames(result) {
    setNumGamesFetched(true);
    setNumGames(result);
  }

  function handleGameCreated(data) {
    const newGameId = data.attributes.gameId;
    if (!gamesInProgress.includes(newGameId)) {
      const newGames = [...gamesInProgress, newGameId];

      openNotification({
        message: "🔊 New Game!",
        description: `New game started: #${newGameId}`,
        type: "info"
      });

      setGamesInProgress(newGames);
    }
    setNumGames(numGames + 1);
  }

  function handleGameDeleted(data) {
    const deletedGameId = data.attributes.gameId;
    const newGames = gamesInProgress.filter(e => e !== deletedGameId);
    setGamesInProgress(newGames);

    openNotification({
      message: "🔊 Game Ended",
      description: `Game #${deletedGameId} ended`,
      type: "info"
    });
  }

  function fetchOnChainMaxConcurrentGames() {
    setMaxConcurrentGamesLoading(true);
    Moralis.executeFunction({
      functionName: "maxConcurrentGames",
      ...options
    })
      .then(result => handleOnChainMaxConcurrentGames(result))
      .catch((e) => console.log(e.message));
  }

  function fetchOnChainGamesInProgress() {
    setGamesInProgressLoading(true)
    Moralis.executeFunction({
      functionName: "getGameIdsInProgress",
      ...options
    })
      .then((result) => handleOnChainGamesInProgress(result))
      .catch((e) => console.log(e.message));
  }

  function fetchOnChainNumGames() {
    setNumGamesLoading(true)
    Moralis.executeFunction({
      functionName: "currentGameId",
      ...options
    })
      .then((result) => handleOnChainNumGames(result))
      .catch((e) => console.log(e.message));
  }

  useEffect(() => {
    setContractAddress(getTexasHoldemV1Address(chainId))
    const opts = {
      contractAddress, abi,
    }
    setOptions(opts)
  }, [chainId, abi, contractAddress])

  //get initial maxConcurrentGames
  useEffect(() => {
    if (!maxConcurrentGames && !maxConcurrentGamesLoading && !maxConcurrentGamesFetched && options && !isWeb3EnableLoading) {
      fetchOnChainMaxConcurrentGames();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxConcurrentGames, maxConcurrentGamesLoading, maxConcurrentGamesFetched, options, isWeb3EnableLoading]);

  //get initial gamesInProgress
  useEffect(() => {
    if (!gamesInProgressLoading && !gamesInProgressFetched && options && !isWeb3EnableLoading) {
      fetchOnChainGamesInProgress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamesInProgressLoading, gamesInProgressFetched, options, isWeb3EnableLoading]);

  //get initial gamesNumGames
  useEffect(() => {
    if (!numGamesLoading && !numGamesFetched && options && !isWeb3EnableLoading) {
      fetchOnChainNumGames();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numGamesLoading, numGamesFetched, options, isWeb3EnableLoading]);

  // refresh games in progress every block
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchOnChainGamesInProgress();
    }, 15000);

    return () => {
      clearTimeout(timeout);
    }
  })

  // set up subs after initial game data fetched
  useMoralisSubscription(`${backendPrefix}THGameStarted`, q => q, [], {
    onEnter: data => handleGameCreated(data),
  });

  useMoralisSubscription(`${backendPrefix}THGameDeleted`, q => q, [], {
    onEnter: data => handleGameDeleted(data),
  });

  return { maxConcurrentGames, gamesInProgress, numGames };
}
