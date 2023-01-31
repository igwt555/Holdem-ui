import React, { useEffect, useState } from "react";
import { useGameMetadata } from "../../../hooks/useGameMetadata";
import { Pagination, Tabs } from "antd";
import { GameHistoryContainer } from "./GameHistoryContainer";
import "./style.scss";

export const History = () => {

  const { numGames, gamesInProgress } = useGameMetadata();

  const [currentItems, setCurrentItems] = useState([]);
  const [gamesPerPage, setGamesPerPage] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    if (numGames === 0) {
      return;
    }
    const games = [];

    for (let i = numGames; i > 0; i--) {
      games.push(i);
    }

    const start = (pageNumber - 1) * gamesPerPage;
    const end = start + gamesPerPage;
    setCurrentItems(games.slice(start, end));

    return () => {
      setCurrentItems([]);
    };
  }, [pageNumber, gamesPerPage, numGames]);

  function handlePageClick(pageNumber) {
    setPageNumber(pageNumber);
  };

  function onShowSizeChange(pageNumber, pageSize) {
    setGamesPerPage(pageSize);
    setPageNumber(pageNumber);
  }

  return (
    <div className="history-wrapper">
      <p className="title">Game History</p>
      <div className="tabs-wrapper">
        <Tabs tabPosition={"left"}>
          {currentItems && currentItems.map((item) => (
            <Tabs.TabPane tab={`Game #${item}`} key={`game_history_tab_${item}`}>
              <GameHistoryContainer gameId={item} key={`game_history_container_${item}`} gamesInProgress={gamesInProgress} />
            </Tabs.TabPane>
          ))}
        </Tabs>
      </div>

      {numGames ?
        <Pagination
          showQuickJumper
          showSizeChanger
          onShowSizeChange={onShowSizeChange}
          defaultCurrent={1}
          total={+numGames}
          onChange={handlePageClick}
        /> : null}
    </div>
  );
}
