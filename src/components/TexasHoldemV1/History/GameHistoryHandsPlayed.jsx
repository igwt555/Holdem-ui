import { useMoralis } from "react-moralis";
import React, { useEffect, useState } from "react";
import { getDealRequestedText, getEllipsisTxt } from "../../../helpers/formatters";
import { Spin, Table } from "antd";
import { PlayingCard } from "../../PlayingCards/PlayingCard";
import { BigNumber } from "@ethersproject/bignumber";
import Moment from "react-moment";
import { getBakendObjPrefix, getCurrencySymbol, getExplorer } from "../../../helpers/networks"

export const GameHistoryHandsPlayed = ({ gameId, round1Price, round2Price, finished = false }) => {

  const { Moralis, chainId } = useMoralis();
  const backendPrefix = getBakendObjPrefix(chainId);
  const currencySymbol = getCurrencySymbol(chainId)

  const [totalFeesPaidFlop, setTotalFeesPaidFlop] = useState("0");
  const [totalFeesPaidTurn, setTotalFeesPaidTurn] = useState("0");
  const [totalFeesPaid, setTotalFeesPaid] = useState("0");
  const [totalWinnings, setTotalWinnings] = useState("0");
  const [houseCut, setHouseCut] = useState("0");
  const [totalWinningsInitialised, setTotalWinningsInitialised] = useState(false);
  const [handsPlayedFlop, setHandsPlayedFlop] = useState([]);
  const [handsPlayedInitialisedFlop, setHandsPlayedInitialisedFlop] = useState(false);
  const [handsPlayedTurn, setHandsPlayedTurn] = useState([]);
  const [handsPlayedInitialisedTurn, setHandsPlayedInitialisedTurn] = useState(false);
  const [highestRoundPlayed, setHighestRoundPlayed] = useState(0);

  const [riverCards, setRiverCards] = useState(null);
  const [riverCardsLoading, setRiverCardsLoading] = useState(false);
  const [riverCardsFetched, setRiverCardsFetched] = useState(false);

  const columns = [
    {
      title: '#',
      dataIndex: 'hand_num',
      key: 'hand_num',
    },
    {
      title: 'Hand',
      dataIndex: 'hand',
      key: 'hand',
    },
    {
      title: 'Player',
      dataIndex: 'player',
      key: 'player',
    },
    {
      title: 'Bet',
      dataIndex: 'bet',
      key: 'bet',
    },
    {
      title: 'Time (UTC)',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: 'Tx Hash',
      dataIndex: 'tx_hash',
      key: 'tx_hash',
    },
  ];

  const fetchHandsPlayedInRound = async (round) => {
    const THHandAdded = Moralis.Object.extend(`${backendPrefix}THHandAdded`);
    const queryTHHandAdded = new Moralis.Query(THHandAdded);
    queryTHHandAdded
      .equalTo("gameId", String(gameId))
      .equalTo("round", round)
      .equalTo("confirmed", true)
      .ascending(["block_timestamp", "transaction_index"]);
    return queryTHHandAdded.find();
  };

  async function getHandsPlayed(round) {
    const resultsTHHandAdded = await fetchHandsPlayedInRound(round);
    const roundPrice = round === "2" ? round1Price : round2Price;

    let roundTotal = BigNumber.from("0");

    const hands = [];
    for (let i = 0; i < resultsTHHandAdded.length; i += 1) {
      if (parseInt(round, 10) > highestRoundPlayed) {
        setHighestRoundPlayed(parseInt(round, 10));
      }
      roundTotal = roundTotal.add(BigNumber.from(roundPrice));
      const res = resultsTHHandAdded[i];
      const player = res.get("player");
      const txHash = res.get("transaction_hash");
      const date = res.get("block_timestamp");

      const hand = <>
        <PlayingCard cardId={res.get("card1")} key={`flop_${i}_${player}_${gameId}_card1`} width={35} />
        <PlayingCard cardId={res.get("card2")} key={`flop_${i}_${player}_${gameId}_card2`} width={35} />
      </>;
      const hd = {
        key: `hands_played_history_${round}_${i}`,
        hand_num: i + 1,
        hand: hand,
        player: <a
          href={`${getExplorer(chainId)}/address/${player}`}
          target={"_blank"}
          rel={"noreferrer"}>
          {getEllipsisTxt(player, 8)}
        </a>,
        tx_hash: <a
          href={`${getExplorer(chainId)}/tx/${txHash}`}
          target={"_blank"}
          rel={"noreferrer"}>
          {getEllipsisTxt(txHash, 8)}
        </a>,
        timestamp: <Moment format="YYYY/MM/DD HH:mm:ss">{date.toString()}</Moment>,
        bet: Moralis.Units.FromWei(roundPrice, 18),
      };

      hands.push(hd);
    }

    if (resultsTHHandAdded.length > 0) {
      hands.push({
        key: resultsTHHandAdded.length,
        player: <strong>Total</strong>,
        bet: <strong>{Moralis.Units.FromWei(roundTotal.toString(), 18)}</strong>
      });
    }

    if (round === "2") {
      setHandsPlayedFlop(hands);
      setTotalFeesPaidFlop(roundTotal.toString());
    }
    if (round === "4") {
      setHandsPlayedTurn(hands);
      setTotalFeesPaidTurn(roundTotal.toString());
    }
  }

  function fetchRiverCards() {
    setRiverCardsLoading(true);
    const THCardDealt = Moralis.Object.extend(`${backendPrefix}THCardDealt`);
    const queryTHCardDealt = new Moralis.Query(THCardDealt);
    queryTHCardDealt
      .equalTo("gameId", String(gameId));
    queryTHCardDealt.find()
      .then((result) => {
        setRiverCardsFetched(true);
        const r = [];
        if (result.length > 0) {
          for(let i = 0; i < result.length; i += 1) {
            r.push(result[i].get("cardId"))
          }
          setRiverCards(r);
        } else {
          setRiverCards([]);
        }
      })
      .catch((e) => console.log(e.message));
  }

  useEffect(() => {
    if (!handsPlayedInitialisedFlop) {
      setHandsPlayedInitialisedFlop(true);
      getHandsPlayed("2");
    }

    if (!handsPlayedInitialisedTurn) {
      setHandsPlayedInitialisedTurn(true);
      getHandsPlayed("4");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, handsPlayedInitialisedFlop, handsPlayedInitialisedTurn]);

  useEffect(() => {

    async function getTotalWinnings() {
      const THWinningsCalculated = Moralis.Object.extend(`${backendPrefix}THWinningsCalculated`);
      const query = new Moralis.Query(THWinningsCalculated);
      query
        .equalTo("gameId", String(gameId));
      const results = await query.find();

      let total = BigNumber.from("0");
      for (let i = 0; i < results.length; i += 1) {
        total = total.add(BigNumber.from(results[i].get("amount")));
      }
      setTotalWinnings(total.toString());

      if (finished) {
        const house = totalFees.sub(total);
        setHouseCut(house.toString());
      }
    }

    if (!totalWinningsInitialised && totalFeesPaidFlop !== "0" && totalFeesPaidTurn !== "0") {
      setTotalWinningsInitialised(true);
      getTotalWinnings();
    }

    const totalFees = BigNumber.from(totalFeesPaidFlop).add(BigNumber.from(totalFeesPaidTurn));
    setTotalFeesPaid(totalFees.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalWinningsInitialised, totalFeesPaidFlop, totalFeesPaidTurn]);


  // fetch River cards
  useEffect(() => {
    if(gameId && !riverCards && !riverCardsFetched && !riverCardsLoading) {
      fetchRiverCards()
    }
  }, [gameId, riverCards, riverCardsLoading, riverCardsFetched])

  if (!handsPlayedInitialisedFlop && !handsPlayedInitialisedTurn && !totalWinningsInitialised) {
    return <Spin className="spin_loader" />;
  }

  return (
    <div>
      <p className="subtitle">Bets, Winnings and House summary</p>

      <p className="desc">Total Flop Bets: {Moralis.Units.FromWei(totalFeesPaidFlop, 18)} {currencySymbol}</p>
      <p className="desc">Total Turn Bets: {Moralis.Units.FromWei(totalFeesPaidTurn, 18)} {currencySymbol}</p>
      <p className="desc">Total Bets: {Moralis.Units.FromWei(totalFeesPaid, 18)} {currencySymbol}</p>

      {
        finished && <>
          <p className="desc">Total Winnings: {Moralis.Units.FromWei(totalWinnings, 18)} {currencySymbol}</p>
          <p className="desc">House Cut: {Moralis.Units.FromWei(houseCut, 18)} {currencySymbol}</p>
        </>
      }

      {
        !finished && <p className="desc">Highest Round Played: {getDealRequestedText(highestRoundPlayed)}</p>
      }

      {
        riverCards && <>
          <p className="subtitle">River Cards Dealt</p>
          <div className={"game_history_river_cards"}>
            {riverCards.map((item, idx) => (
              <div key={`history_river_col_${item}_${gameId}`}>
                <PlayingCard
                  cardId={item}
                  key={`history_card_in_river${item}_${gameId}`}
                  width={80}
                />
              </div>
            ))}
          </div>
        </>
      }

      <p className="subtitle">Hands played in Flop</p>

      <Table
        dataSource={handsPlayedFlop}
        columns={columns}
        pagination={false}
        bordered
        size={"small"}
      />

      <p className="subtitle">Hands played in Turn</p>

      {handsPlayedTurn.length > 0 ?
        <Table
          dataSource={handsPlayedTurn}
          columns={columns}
          pagination={false}
          bordered
          size={"small"}
        />
        : <p className="desc">No hands played in Turn</p>
      }
    </div>
  );
}
