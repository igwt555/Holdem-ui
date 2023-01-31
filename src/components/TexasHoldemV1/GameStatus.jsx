import React from "react";
import { getRoundStatusText } from "../../helpers/formatters";
import { Spin } from "antd";

export const GameStatus = ({ status, gameHasEnded }) => {

  let spinner = <></>;
  if (status === 1 || status === 3 || status === 5) {
    spinner = <Spin className="spin_loader" />;
  }
  return (
    <>
      {
        gameHasEnded ? <strong style={{ color: "white" }}>Game Ended!</strong> : <span style={{ color: "white" }}>{spinner}{getRoundStatusText(status)}</span>
      }
    </>
  );
}