import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import abis from "../helpers/contracts";
import { getChainType, getHoldemHeroesAddress } from "../helpers/networks"
import { BigNumber } from "@ethersproject/bignumber"

export const useNFTSaleInfo = () => {
  const { Moralis, isInitialized, chainId } = useMoralis();

  const abi = abis.heh_nft;

  const [fetched, setFetched] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [dataInitialised, setDataInitialised] = useState(false);
  const [contractAddress, setContractAddress] = useState(null);
  const [options, setOptions] = useState(null);
  const [targetEms, setTargetEms] = useState(null);
  const [startBlockNum, setStartBlockNum] = useState(null);
  const [revealTime, setRevealTime] = useState(null);
  const [startingIndex, setStartingIndex] = useState(null);
  const [maxPerTxOrOwner, setMaxPerTxOrOwner] = useState(null);
  const [pricePerToken, setPricePerToken] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);

  useEffect(() => {
    if(chainId && !contractAddress) {
      const cA = getHoldemHeroesAddress( chainId );
      setContractAddress( cA )
      const opts = {
        contractAddress: cA, abi,
      }
      setOptions(opts)
    }
  }, [chainId, contractAddress, abi]);

  const targetEmsFetch = async () => {
    if(chainId && contractAddress && options) {
      if ( getChainType( chainId ) === "l1" ) {
        Moralis.executeFunction( {
          functionName: "targetEMS",
          ...options
        } )
          .then( ( result ) => {
            setTargetEms( result )
          } )
          .catch( ( e ) => console.log( e.message ) );
      } else {
        setTargetEms( BigNumber.from( "0" ) )
      }
    }
  }

  const startBlockNumFetch = async () => {
    if(chainId && contractAddress && options) {
      if ( getChainType( chainId ) === "l1" ) {
        Moralis.executeFunction( {
          functionName: "SALE_START_BLOCK_NUM",
          ...options
        } )
          .then( ( result ) => {
            setStartBlockNum( result )
          } )
          .catch( ( e ) => console.log( e.message ) );
      } else {
        setStartBlockNum( BigNumber.from( "0" ) )
      }
    }
  }

  const revealTimeFetch = async () => {
    if(chainId && contractAddress && options) {
      Moralis.executeFunction( {
        functionName: "REVEAL_TIMESTAMP",
        ...options
      } )
        .then( ( result ) => {
          setRevealTime( result )
        } )
        .catch( ( e ) => console.log( e.message ) );
    }
  }

  const startingIndexFetch = async () => {
    if(chainId && contractAddress && options) {
      Moralis.executeFunction( {
        functionName: "startingIndex",
        ...options
      } )
        .then( ( result ) => {
          setStartingIndex( result )
        } )
        .catch( ( e ) => console.log( e.message ) );
    }
  }

  const maxPerTxOrOwnerFetch = async () => {
    if(chainId && contractAddress && options) {
      if ( getChainType( chainId ) === "l1" ) {
        Moralis.executeFunction( {
          functionName: "MAX_PER_ADDRESS_OR_TX",
          ...options
        } )
          .then( ( result ) => {
            setMaxPerTxOrOwner( result )
          } )
          .catch( ( e ) => console.log( e.message ) );
      } else {
        setMaxPerTxOrOwner( BigNumber.from( "0" ) )
      }
    }
  }

  const pricePerTokenFetch = async () => {
    if(chainId && contractAddress && options) {
      if ( getChainType( chainId ) === "l1" ) {
        Moralis.executeFunction( {
          functionName: "getNftPrice",
          ...options
        } )
          .then( ( result ) => {
            setPricePerToken( result )
          } )
          .catch( ( e ) => console.log( e.message ) );
      } else {
        setPricePerToken( BigNumber.from( "0" ) )
      }
    }
  }

  const totalSupplyFetch = async () => {
    if(chainId && contractAddress && options) {
      Moralis.executeFunction( {
        functionName: "totalSupply",
        ...options
      } )
        .then( ( result ) => {
          setTotalSupply( result )
        } )
        .catch( ( e ) => console.log( e.message ) );
    }
  }

  useEffect(() => {
    if (isInitialized && chainId && !fetched && contractAddress && !isFetching) {
      setIsFetching(true);
      initData();
    }

    if (startBlockNum !== null &&
      revealTime !== null &&
      startingIndex !== null &&
      maxPerTxOrOwner !== null &&
      pricePerToken !== null &&
      totalSupply !== null &&
      targetEms !== null) {
      setDataInitialised(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    chainId,
    isInitialized,
    fetched,
    startBlockNum,
    revealTime,
    startingIndex,
    maxPerTxOrOwner,
    pricePerToken,
    totalSupply,
    targetEms,
    contractAddress,
    isFetching
  ]);

  const initData = () => {
    startBlockNumFetch();
    revealTimeFetch();
    startingIndexFetch();
    pricePerTokenFetch();
    totalSupplyFetch();
    maxPerTxOrOwnerFetch();
    targetEmsFetch();
    setFetched(true);
    setIsFetching(false);
  };

  return {
    startBlockNumFetch,
    revealTimeFetch,
    startingIndexFetch,
    maxPerTxOrOwnerFetch,
    pricePerTokenFetch,
    totalSupplyFetch,
    targetEmsFetch,
    dataInitialised,
    startBlockNum,
    revealTime,
    startingIndex,
    maxPerTxOrOwner,
    pricePerToken,
    totalSupply,
    targetEms,
    initData,
  };
};
