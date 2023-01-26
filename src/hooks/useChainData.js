import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

export const useChainData = () => {
  const { isInitialized, isWeb3EnableLoading, chainId, Moralis } = useMoralis();

  const [ currentBlock, setCurrentBlock ] = useState(0);
  const [ currentBlockFetched, setCurrentBlockFetched] = useState(false);
  const [ currentBlockLoading, setCurrentBlockLoading] = useState(false);

  function fetchCurrentBlock() {
    setCurrentBlockLoading(true);
    Moralis.Web3API.native.getDateToBlock({
      chain: chainId,
      date: new Date(),
    }).then( d => {
      setCurrentBlock( d?.block || 0 )
      setCurrentBlockFetched(true);
      setCurrentBlockLoading(false);
    }).catch((e) => console.log(e.message));
  }

  useEffect(() => {
    if (chainId && currentBlock === 0 && isInitialized && !currentBlockFetched && !currentBlockLoading && !isWeb3EnableLoading) {
      fetchCurrentBlock();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, currentBlock, isInitialized, currentBlockFetched, currentBlockLoading, isWeb3EnableLoading]);

  const refresh = () => {
    fetchCurrentBlock();
  };

  return {
    refresh,
    currentBlock,
    currentBlockFetched,
    currentBlockLoading,
  };
};
