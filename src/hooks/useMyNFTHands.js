import { useEffect, useState } from "react";
import { useMoralis, useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { useIPFS } from "./useIPFS";
import { getGameIsLive, getHoldemHeroesAddress, getTexasHoldemV1Address } from "../helpers/networks"
import abis from "../helpers/contracts";

export const useMyNFTHands = (options) => {
  const { account } = useMoralisWeb3Api();
  const { Moralis, chainId, account: walletAddress, isAuthenticated } = useMoralis();

  const thAbi = abis.texas_holdem_v1;
  const { resolveLink } = useIPFS();

  const [NFTHands, setNFTHands] = useState([]);
  const [dataInitialiseRequested, setDataInitialiseRequested] = useState(false);
  const [hehContractAddress, setHehContractAddress] = useState(getHoldemHeroesAddress(chainId));
  const [texasHoldemAddress, setTexasHoldemAddress] = useState(getTexasHoldemV1Address(chainId));
  const [gameIsLive, setGameIsLive] = useState(false);

  const {
    fetch: getMyNFTHands,
    data,
    error,
    isLoading,
  } = useMoralisWeb3ApiCall(
    account.getNFTsForContract,
    { chain: chainId, token_address: hehContractAddress, address: walletAddress, ...options },
    { autoFetch: false }
  );

  useEffect(() => {
    if(chainId) {
      setHehContractAddress( getHoldemHeroesAddress( chainId ) );
      setTexasHoldemAddress( getTexasHoldemV1Address( chainId ) );
      setGameIsLive( getGameIsLive( chainId ) );
      if(!dataInitialiseRequested && !isLoading && isAuthenticated) {
        getMyNFTHands();
        setDataInitialiseRequested(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, dataInitialiseRequested, isLoading, isAuthenticated])

  useEffect(() => {
    if (data?.result) {
      const NFTs = data.result;
      for (let NFT of NFTs) {
        if (NFT?.metadata) {
          NFT.metadata = JSON.parse(NFT.metadata);
          NFT.image = resolveLink(NFT.metadata?.image);
        }
        if (NFT?.token_id && gameIsLive) {
          fetchHandData(NFT.token_id)
            .then((d) => {
              if (d?.card1.toString() && d?.card2.toString() && d?.handId.toString()) {
                NFT.card1 = parseInt(d.card1, 10);
                NFT.card2 = parseInt(d.card2, 10);
                NFT.handId = parseInt(d.handId, 10);
              }
            })
            .catch((e) => console.log(e.message));
        }
      }
      setNFTHands(NFTs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, gameIsLive]);

  const fetchHandData = async (tokenId) => {
    return await Moralis.executeFunction({
      contractAddress: texasHoldemAddress,
      functionName: "getTokenDataWithHandId",
      abi: thAbi,
      params: {
        "_tokenId": String(tokenId),
      },
    })
      .then((result) => result)
      .catch((e) => console.log(e.message));
  };

  return { getMyNFTHands, NFTHands, error, isLoading };
};
