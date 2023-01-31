import React, { useState, useEffect } from "react";
import { Pagination, Checkbox, Slider } from 'antd';
import NFTList from "./NFTList";
import { useMoralis } from "react-moralis";
import { MAX_TOTAL_SUPPLY } from "../../helpers/constant";

export default function PostRevealSale({ mintedTokens }) {

  const [currentItems, setCurrentItems] = useState(null);
  const [tokensPerPage, setTokensPerPage] = useState(12);
  const [pageNumber, setPageNumber] = useState(1);
  const [minted, setMinted] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [shape, setShape] = useState(["Offsuit", "Suited", "Pair"]);
  const [ranksRange, setRanksRange] = useState([1, 169]);
  const [marks, setMarks] = useState({ 1: '1', 169: '169' });

  const { Moralis } = useMoralis();

  const options = [
    { label: "Offsuit", value: "Offsuit" },
    { label: "Suited", value: "Suited" },
    { label: "Pair", value: "Pair" }
  ];

  useEffect(() => {
    let filtered = [];
    const Hands = Moralis.Object.extend("Hands");
    let query = new Moralis.Query(Hands);
    query.containedIn("shape", shape)
      .greaterThanOrEqualTo("rank", parseInt(ranksRange[0]))
      .lessThanOrEqualTo("rank", parseInt(ranksRange[1]))
      .limit(MAX_TOTAL_SUPPLY)
      .find()
      .then((result) => {
        for (let i = 0; i < result.length; i++) {
          filtered.push(result[i].get("tokenId"));
        }
        let tmp = [];
        if (mintedTokens.length) {
          for (let i = 0; i < filtered.length; i++) {
            if (minted && mintedTokens.includes(filtered[i])) tmp.push(filtered[i]);
            if (!minted && !mintedTokens.includes(filtered[i])) tmp.push(filtered[i]);
          }
        }
        setTokens([...tmp]);
      });

    // cleanup function
    return () => {
      setTokens([]);
      query = null;
    }
    // eslint-disable-next-line
  }, [minted, mintedTokens, shape, ranksRange]);

  useEffect(() => {
    const start = (pageNumber - 1) * tokensPerPage;
    const end = start + tokensPerPage;
    setCurrentItems(tokens.slice(start, end));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, tokensPerPage, tokens]);

  const handlePageClick = (pageNumber) => {
    setPageNumber(pageNumber);
  };

  function onShowSizeChange(pageNumber, pageSize) {
    setTokensPerPage(pageSize);
    setPageNumber(pageNumber);
  }

  function switchTab(event) {
    event.preventDefault();
    if (event.target.innerHTML === "Minted") setMinted(true);
    else if (event.target.innerHTML === "Not minted") setMinted(false);
  }

  function handleShapeChange(checkedValues) {
    setShape([...checkedValues]);
  }

  function handleRankChange(value) {
    setMarks({ [value[0]]: `${value[0]}`, [value[1]]: `${value[1]}` });
    setRanksRange([...value]);
  }

  return (
    <>
      <div className="sales-header">
        <ul className="tabs" onClick={switchTab}>
          <li><p className={!minted ? "active" : ""}>Not minted</p></li>
          <li><p className={minted ? "active" : ""}>Minted</p></li>
        </ul>
      </div>

      <div className="sales-main">
        <div className="filter_sidebar">
          <p className="title">Filters</p>
          <div className="filter_body">
            <div className="filter_item">
              <p>Shape</p>
              <Checkbox.Group options={options} onChange={handleShapeChange} defaultValue={["Offsuit", "Suited", "Pair"]} />
            </div>
            <div className="filter_item">
              <p>Rank</p>
              <Slider range marks={marks} defaultValue={[1, 169]} min={1} max={169} onChange={handleRankChange}></Slider>
            </div>
          </div>
        </div>

        <div className="nft_list-wrapper">
          <NFTList currentTokens={currentItems} mintedTokens={mintedTokens} />

          {tokens.length ?
            <div>
              <Pagination
                showQuickJumper
                showSizeChanger
                onShowSizeChange={onShowSizeChange}
                defaultCurrent={1}
                total={tokens.length}
                onChange={handlePageClick}
              />
            </div> : null}
        </div>
      </div>
    </>
  );
}
