import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import abis from "../../helpers/contracts";
import { getTexasHoldemV1Address } from "../../helpers/networks";

export const RankName = ({ rank }) => {

  const { Moralis, chainId } = useMoralis();

  const abi = abis.texas_holdem_v1;
  const contractAddress = getTexasHoldemV1Address(chainId);

  const options = {
    contractAddress, abi,
  };

  const [rankName, setRankName] = useState(null);

  useEffect(() => {
    async function getRankName() {
      const rId = await Moralis.executeFunction({
        functionName: "getRankId",
        params: {
          "value": String(rank),
        },
        ...options
      })
        .then((result) => result)
        .catch((e) => console.log(e.message));

      const r = await Moralis.executeFunction({
        functionName: "getRankName",
        params: {
          "rank": rId,
        },
        ...options
      })
        .then((result) => result)
        .catch((e) => console.log(e.message));

      setRankName(r);
    }

    if (!rankName) {
      getRankName();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rankName, rank]);

  return (
    <span>{rankName}</span>
  );
}
