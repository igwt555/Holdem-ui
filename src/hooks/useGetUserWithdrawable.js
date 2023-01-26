import { useEffect, useState } from "react";
import { useMoralis, useMoralisSubscription } from "react-moralis";
import { getBakendObjPrefix, getGameIsLive, getTexasHoldemV1Address } from "../helpers/networks"
import abis from "../helpers/contracts";
import { openNotification } from "../helpers/notifications";

export const useGetUserWithdrawable = () => {
  const { Moralis, isWeb3Enabled, chainId, account } = useMoralis();
  const backendPrefix = getBakendObjPrefix(chainId);

  const gameIsLive = getGameIsLive(chainId);

  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceFetched, setBalanceFetched] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const abi = abis.texas_holdem_v1;
  const contractAddress = getTexasHoldemV1Address(chainId);

  const options = {
    contractAddress, abi,
  };

  function handleOnChainWithdrawable(result) {
    setBalanceFetched(true);
    setBalance(result);
  }

  function fetchOnChainWithdrawable() {
    if(!gameIsLive) {
      return
    }
    setBalanceLoading(true);
    Moralis.executeFunction({
      functionName: "userWithdrawables",
      params: {
        "": account,
      },
      ...options
    })
      .then((result) => handleOnChainWithdrawable(result))
      .catch((e) => console.log(e.message));
  }

  //get initial balance
  useEffect(() => {
    if (balance === null && !balanceFetched && !balanceLoading && isWeb3Enabled && gameIsLive) {
      fetchOnChainWithdrawable();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance, balanceFetched, balanceLoading, account, isWeb3Enabled, gameIsLive]);

  // check refetch
  useEffect(() => {
    let timeout;
    if (refetch) {
      setRefetch(false);
      timeout = setTimeout(() => {
        fetchOnChainWithdrawable()
      }, 3000);
      fetchOnChainWithdrawable();
    }

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  // refresh withdrawable every 2nd block
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchOnChainWithdrawable();
    }, 30000);

    return () => {
      clearTimeout(timeout);
    };
  });

  useMoralisSubscription(`${backendPrefix}THRefunded`,
    q => q.equalTo("player", account),
    [account],
    {
      onEnter: data => {
        openNotification({
          message: "🔊 Refunded!",
          description: `📃 Refund successful`,
          type: "success"
        });
        setRefetch(true)
      },
    });

  useMoralisSubscription(`${backendPrefix}THWinningsCalculated`,
    q => q,
    [],
    {
      onEnter: data => {
        setRefetch(true)
      },
    });

  useMoralisSubscription(`${backendPrefix}THWithdrawal`,
    q => q.equalTo("player", account),
    [account],
    {
      onEnter: data => {
        openNotification({
          message: "🔊 Success!",
          description: `📃 Withdraw successful`,
          type: "success"
        });
        setRefetch(true)
      },
    });

  return { balance };
};
