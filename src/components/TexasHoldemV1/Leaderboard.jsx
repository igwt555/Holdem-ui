import React, { useEffect, useState } from "react";
import { useMoralis, useMoralisSubscription } from "react-moralis";
import { Spin, Table } from "antd";
import { PlayingCard } from "../PlayingCards/PlayingCard";
import { getEllipsisTxt, sortFinalHand } from "../../helpers/formatters";
import { RankName } from "./RankName";
import {
  getBakendObjPrefix,
  getCurrencySymbol,
  getExplorer,
} from "../../helpers/networks";
import { BigNumber } from "@ethersproject/bignumber";

export const Leaderboard = ({ gameId, showWinnings = false, claimWinner }) => {
  const { Moralis, chainId, account } = useMoralis();
  const backendPrefix = getBakendObjPrefix(chainId);
  const currencySymbol = getCurrencySymbol(chainId);

  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardTableData, setLeaderboardTableData] = useState([]);
  const [leaderboardInitialised, setLeaderboardInitialised] = useState(false);

  const [winnings, setWinnings] = useState({});
  const [winningsInitialised, setWinningsInitialised] = useState(false);

  const cups = [<GoldCup />, <SilverCup />, <Cup />];

  const columns = [
    {
      title: "",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Hand",
      dataIndex: "hand",
      key: "hand",
    },
    {
      title: "Player",
      dataIndex: "player",
      key: "player",
    },
    {
      title: "Tx",
      dataIndex: "tx_hash",
      key: "tx_hash",
    },
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
    },
    {
      title: "Rank Name",
      dataIndex: "rank_name",
      key: "rank_name",
    },
  ];

  if (showWinnings) {
    columns.push({
      title: "Winnings",
      dataIndex: "winnings",
      key: "winnings",
    });
  }

  function compareValues(key, order = "asc") {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order === "desc" ? comparison * -1 : comparison;
    };
  }

  const sortLeaderboard = (lb) => {
    let newLb = [];
    if (lb.length > 0) {
      newLb = [...lb].sort(compareValues("rank", "asc"));
    }
    return newLb;
  };

  useEffect(() => {
    async function getLeaderboard() {
      const THFinalHandPlayed = Moralis.Object.extend(
        `${backendPrefix}THFinalHandPlayed`
      );
      const queryTHFinalHandPlayed = new Moralis.Query(THFinalHandPlayed);
      queryTHFinalHandPlayed.equalTo("gameId", String(gameId));
      const resultsTHFinalHandPlayed = await queryTHFinalHandPlayed.find();

      const lb = [];
      for (let i = 0; i < resultsTHFinalHandPlayed.length; i += 1) {
        const res = resultsTHFinalHandPlayed[i];
        const fh = {};
        const cTmp = sortFinalHand(
          res.get("card1"),
          res.get("card2"),
          res.get("card3"),
          res.get("card4"),
          res.get("card5")
        );
        fh.player = res.get("player");
        fh.card1 = cTmp[0];
        fh.card2 = cTmp[1];
        fh.card3 = cTmp[2];
        fh.card4 = cTmp[3];
        fh.card5 = cTmp[4];
        fh.rank = parseInt(res.get("rank"), 10);
        fh.txHash = res.get("transaction_hash");
        lb.push(fh);
      }

      setLeaderboard(sortLeaderboard(lb));
    }

    if (!leaderboardInitialised) {
      setLeaderboardInitialised(true);
      getLeaderboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, leaderboardInitialised]);

  useEffect(() => {
    async function getWinnings() {
      const THWinningsCalculated = Moralis.Object.extend(
        `${backendPrefix}THWinningsCalculated`
      );
      const queryTHWinningsCalculated = new Moralis.Query(THWinningsCalculated);
      queryTHWinningsCalculated.equalTo("gameId", String(gameId));
      const resultsTHWinningsCalculated =
        await queryTHWinningsCalculated.find();

      const w = {};
      for (let i = 0; i < resultsTHWinningsCalculated.length; i += 1) {
        const res = resultsTHWinningsCalculated[i];
        const player = res.get("player");
        const amount = res.get("amount");
        w[player] = amount;
      }
      setWinnings(w);
    }

    if (!winningsInitialised) {
      setWinningsInitialised(true);
      if (showWinnings) {
        getWinnings();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, winningsInitialised, showWinnings]);

  function handleFinalHandPlayed(data) {
    const gId = parseInt(data.attributes.gameId, 10);
    const newLb = [...leaderboard];

    if (gId === parseInt(gameId, 10)) {
      const fh = {};
      const cTmp = sortFinalHand(
        data.attributes.card1,
        data.attributes.card2,
        data.attributes.card3,
        data.attributes.card4,
        data.attributes.card5
      );
      fh.player = data.attributes.player;
      fh.card1 = cTmp[0];
      fh.card2 = cTmp[1];
      fh.card3 = cTmp[2];
      fh.card4 = cTmp[3];
      fh.card5 = cTmp[4];
      fh.rank = parseInt(data.attributes.rank, 10);

      newLb.push(fh);
    }
    setLeaderboard(sortLeaderboard(newLb));
  }

  useEffect(() => {
    const data = [];
    if (winningsInitialised && leaderboardInitialised) {
      if (leaderboard.length && claimWinner) {
        if(leaderboard.length > 1) {
          claimWinner( leaderboard[0].player === account || leaderboard[1].player === account );
        } else {
          claimWinner( leaderboard[0].player === account );
        }
      }
      for (let i = 0; i < leaderboard.length; i += 1) {
        const h = (
          <>
            <PlayingCard
              cardId={leaderboard[i].card1}
              key={`leaderboard_${i}_${leaderboard[i].player}_${gameId}_card1`}
              width={35}
            />
            <PlayingCard
              cardId={leaderboard[i].card2}
              key={`leaderboard_${i}_${leaderboard[i].player}_${gameId}_card2`}
              width={35}
            />
            <PlayingCard
              cardId={leaderboard[i].card3}
              key={`leaderboard_${i}_${leaderboard[i].player}_${gameId}_card3`}
              width={35}
            />
            <PlayingCard
              cardId={leaderboard[i].card4}
              key={`leaderboard_${i}_${leaderboard[i].player}_${gameId}_card4`}
              width={35}
            />
            <PlayingCard
              cardId={leaderboard[i].card5}
              key={`leaderboard_${i}_${leaderboard[i].player}_${gameId}_card5`}
              width={35}
            />
          </>
        );

        const player = getEllipsisTxt(leaderboard[i].player, 6);
        const rankName = (
          <RankName
            rank={leaderboard[i].rank}
            key={`${gameId}_${leaderboard[i].rank}`}
          />
        );

        const d = {
          key: i,
          position:
            leaderboard[i].player === account ? (
              <>
                {i < 2 ? cups[i] : cups[2]}
                <strong>{i + 1}</strong>
              </>
            ) : (
              <>
                {i < 2 ? cups[i] : cups[2]}
                {i + 1}
              </>
            ),
          hand: h,
          player:
            leaderboard[i].player === account ? (
              <strong>
                <a
                  href={`${getExplorer(chainId)}/address/${
                    leaderboard[i].player
                  }`}
                  target={"_blank"}
                  rel={"noreferrer"}
                >
                  {player}
                </a>
              </strong>
            ) : (
              <a
                href={`${getExplorer(chainId)}/address/${
                  leaderboard[i].player
                }`}
                target={"_blank"}
                rel={"noreferrer"}
              >
                {player}
              </a>
            ),
          rank:
            leaderboard[i].player === account ? (
              <strong>{leaderboard[i].rank}</strong>
            ) : (
              leaderboard[i].rank
            ),
          rank_name:
            leaderboard[i].player === account ? (
              <strong>{rankName}</strong>
            ) : (
              rankName
            ),
          tx_hash:
            leaderboard[i].player === account ? (
              <strong>
                <a
                  href={`${getExplorer(chainId)}/tx/${leaderboard[i].txHash}`}
                  target={"_blank"}
                  rel={"noreferrer"}
                >
                  {getEllipsisTxt(leaderboard[i].txHash, 4)}
                </a>
              </strong>
            ) : (
              <a
                href={`${getExplorer(chainId)}/address/${
                  leaderboard[i].txHash
                }`}
                target={"_blank"}
                rel={"noreferrer"}
              >
                {getEllipsisTxt(leaderboard[i].txHash, 4)}
              </a>
            ),
        };

        if (showWinnings && winnings[leaderboard[i]?.player]) {
          const w = Moralis.Units.FromWei(
            BigNumber.from(winnings[leaderboard[i].player]),
            18
          );
          d.winnings =
            leaderboard[i].player === account ? (
              <strong>
                {w} {currencySymbol}
              </strong>
            ) : (
              <>
                {w} {currencySymbol}
              </>
            );
        }

        data.push(d);
      }
    }
    setLeaderboardTableData(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaderboard, winnings, leaderboardInitialised, winningsInitialised]);

  // subscribe to FinalHandPlayed events - THFinalHandPlayed
  useMoralisSubscription(
    `${backendPrefix}THFinalHandPlayed`,
    (q) => q.equalTo("gameId", String(gameId)),
    [gameId, account],
    {
      onEnter: (data) => handleFinalHandPlayed(data),
    }
  );

  if (!leaderboardInitialised || !winningsInitialised) {
    return <Spin className="spin_loader" />;
  }

  return (
    <>
      <Table
        dataSource={leaderboardTableData}
        columns={columns}
        pagination={false}
        bordered
        size={"small"}
      />
    </>
  );
};

export const Cup = () => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.175 0.9H12.45V0.15C12.45 0.0675 12.3825 0 12.3 0H2.7C2.6175 0 2.55 0.0675 2.55 0.15V0.9H0.825C0.606196 0.9 0.396354 0.986919 0.241637 1.14164C0.0869193 1.29635 0 1.5062 0 1.725V4.5C0 6.03188 1.125 7.305 2.59125 7.5375C2.88188 9.71625 4.63125 11.4319 6.825 11.6719V13.6444H3.15C2.81813 13.6444 2.55 13.9125 2.55 14.2444V14.85C2.55 14.9325 2.6175 15 2.7 15H12.3C12.3825 15 12.45 14.9325 12.45 14.85V14.2444C12.45 13.9125 12.1819 13.6444 11.85 13.6444H8.175V11.6719C10.3688 11.4319 12.1181 9.71625 12.4088 7.5375C13.875 7.305 15 6.03188 15 4.5V1.725C15 1.5062 14.9131 1.29635 14.7584 1.14164C14.6036 0.986919 14.3938 0.9 14.175 0.9ZM1.35 4.5V2.25H2.55V6.1425C2.20171 6.03125 1.89779 5.8122 1.6821 5.51698C1.46641 5.22175 1.35011 4.86562 1.35 4.5ZM11.1 6.9C11.1 7.82063 10.7419 8.68875 10.0894 9.33937C9.43688 9.99187 8.57063 10.35 7.65 10.35H7.35C6.42938 10.35 5.56125 9.99187 4.91062 9.33937C4.25813 8.68688 3.9 7.82063 3.9 6.9V1.35H11.1V6.9ZM13.65 4.5C13.65 5.26875 13.1456 5.92125 12.45 6.1425V2.25H13.65V4.5Z"
        fill="#D4D4D4"
        fill-opacity="0"
      />
    </svg>
  );
};

export const GoldCup = () => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.175 0.9H12.45V0.15C12.45 0.0675 12.3825 0 12.3 0H2.7C2.6175 0 2.55 0.0675 2.55 0.15V0.9H0.825C0.606196 0.9 0.396354 0.986919 0.241637 1.14164C0.0869193 1.29635 0 1.5062 0 1.725V4.5C0 6.03188 1.125 7.305 2.59125 7.5375C2.88188 9.71625 4.63125 11.4319 6.825 11.6719V13.6444H3.15C2.81813 13.6444 2.55 13.9125 2.55 14.2444V14.85C2.55 14.9325 2.6175 15 2.7 15H12.3C12.3825 15 12.45 14.9325 12.45 14.85V14.2444C12.45 13.9125 12.1819 13.6444 11.85 13.6444H8.175V11.6719C10.3688 11.4319 12.1181 9.71625 12.4088 7.5375C13.875 7.305 15 6.03188 15 4.5V1.725C15 1.5062 14.9131 1.29635 14.7584 1.14164C14.6036 0.986919 14.3938 0.9 14.175 0.9ZM1.35 4.5V2.25H2.55V6.1425C2.20171 6.03125 1.89779 5.8122 1.6821 5.51698C1.46641 5.22175 1.35011 4.86562 1.35 4.5ZM11.1 6.9C11.1 7.82063 10.7419 8.68875 10.0894 9.33937C9.43688 9.99187 8.57063 10.35 7.65 10.35H7.35C6.42938 10.35 5.56125 9.99187 4.91062 9.33937C4.25813 8.68688 3.9 7.82063 3.9 6.9V1.35H11.1V6.9ZM13.65 4.5C13.65 5.26875 13.1456 5.92125 12.45 6.1425V2.25H13.65V4.5Z"
        fill="#FFC700"
      />
    </svg>
  );
};

export const SilverCup = () => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.175 0.9H12.45V0.15C12.45 0.0675 12.3825 0 12.3 0H2.7C2.6175 0 2.55 0.0675 2.55 0.15V0.9H0.825C0.606196 0.9 0.396354 0.986919 0.241637 1.14164C0.0869193 1.29635 0 1.5062 0 1.725V4.5C0 6.03188 1.125 7.305 2.59125 7.5375C2.88188 9.71625 4.63125 11.4319 6.825 11.6719V13.6444H3.15C2.81813 13.6444 2.55 13.9125 2.55 14.2444V14.85C2.55 14.9325 2.6175 15 2.7 15H12.3C12.3825 15 12.45 14.9325 12.45 14.85V14.2444C12.45 13.9125 12.1819 13.6444 11.85 13.6444H8.175V11.6719C10.3688 11.4319 12.1181 9.71625 12.4088 7.5375C13.875 7.305 15 6.03188 15 4.5V1.725C15 1.5062 14.9131 1.29635 14.7584 1.14164C14.6036 0.986919 14.3938 0.9 14.175 0.9ZM1.35 4.5V2.25H2.55V6.1425C2.20171 6.03125 1.89779 5.8122 1.6821 5.51698C1.46641 5.22175 1.35011 4.86562 1.35 4.5ZM11.1 6.9C11.1 7.82063 10.7419 8.68875 10.0894 9.33937C9.43688 9.99187 8.57063 10.35 7.65 10.35H7.35C6.42938 10.35 5.56125 9.99187 4.91062 9.33937C4.25813 8.68688 3.9 7.82063 3.9 6.9V1.35H11.1V6.9ZM13.65 4.5C13.65 5.26875 13.1456 5.92125 12.45 6.1425V2.25H13.65V4.5Z"
        fill="#C0C0C0"
      />
    </svg>
  );
};
