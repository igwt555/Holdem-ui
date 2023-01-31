import { useMoralis } from "react-moralis";
import React, { useEffect, useState } from "react";
import { Spin, Table } from "antd";
import { BigNumber } from "@ethersproject/bignumber";
import { getBakendObjPrefix, getExplorer } from "../../../helpers/networks"
import { getEllipsisTxt } from "../../../helpers/formatters";
import Moment from "react-moment";

export const GameHistoryProcessedRefunds = ({ gameId }) => {

  const { Moralis, chainId } = useMoralis();
  const backendPrefix = getBakendObjPrefix(chainId);

  const [gameRefundsData, setGameRefundsData] = useState(null);
  const [gameRefundsDataInitialised, setGameRefundsDataInitialised] = useState(false);

  const columns = [
    {
      title: '#',
      dataIndex: 'refund_num',
      key: 'refund_num',
    },
    {
      title: 'Player',
      dataIndex: 'player',
      key: 'player',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
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

  useEffect(() => {

    async function getRefundData() {
      const THRefunded = Moralis.Object.extend(`${backendPrefix}THRefunded`);
      const query = new Moralis.Query(THRefunded);
      query
        .equalTo("gameId", String(gameId))
        .ascending(["block_timestamp", "transaction_index"]);
      const results = await query.find();

      let total = BigNumber.from("0");

      const data = [];

      for (let i = 0; i < results.length; i += 1) {
        const res = results[i];
        const player = res.get("player");
        const txHash = res.get("transaction_hash");
        const date = res.get("block_timestamp");
        const amount = res.get("amount");

        total = total.add(BigNumber.from(amount));

        const d = {
          key: `refunds_${gameId}_${i}`,
          refund_num: i + 1,
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
          amount: Moralis.Units.FromWei(amount, 18),
        };

        data.push(d);
      }

      data.push({
        key: `refunds_${gameId}_total`,
        player: <strong>Total</strong>,
        amount: <strong>{Moralis.Units.FromWei(total.toString(), 18)}</strong>,
      });

      setGameRefundsData(data);
    }

    if (!gameRefundsDataInitialised) {
      setGameRefundsDataInitialised(true);
      getRefundData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, gameRefundsDataInitialised]);

  if (!gameRefundsDataInitialised) {
    return <Spin className="spin_loader" />;
  }

  return (
    <div>
      <p className="subtitle">Processed Refunds</p>

      <Table
        dataSource={gameRefundsData}
        columns={columns}
        pagination={false}
        bordered
        size={"small"}
      />
    </div>
  );
}
