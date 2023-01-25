import React from "react";
import { NavLink } from "react-router-dom";
import "./style.scss";
import AnimateButton from "../../components/AnimateButton";
import Timeline from "../../components/Timeline";
import { Roadmap } from "../../roadmap";
import { MAX_TOTAL_SUPPLY } from "../../helpers/constant";

export default function HomeL2() {
  return (
    <>
      <div className="header-background"></div>
      <div className="main-wrapper">
        <div className="section__nft-poker--wrapper" id="section__nft-poker">
          <div className="section__nft-poker">
            <div className="section__nft-poker--left">
              <p className="title">NFT Poker</p>
              <p className="desc">
                Holdem Heroes is the on-chain NFT Poker game. <br />
                Mint the {MAX_TOTAL_SUPPLY} Hole Card combinations as NFTs.
                <br />
                Then play Texas Hold&#x27;em with them!
                <br />
                Mint price is dynamic with{" "}
                <a
                  href="http://dynamicdrops.xyz"
                  target="_blank"
                  rel="noreferrer"
                >
                  Dynamic Drops
                </a>
                .
              </p>
              <div className="video-container--16x9 mobile">
                <div className="inner-wrapper">
                  <iframe
                    src="https://www.youtube.com/embed/IRiglLJ_1Ak"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title="video"
                  />
                </div>
              </div>
            </div>
            <div className="section__nft-poker--right">
              <div className="video-container--16x9">
                <div className="inner-wrapper">
                  <iframe
                    src="https://www.youtube.com/embed/IRiglLJ_1Ak"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title="video"
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "160px" }}>
            <Timeline />
          </div>
        </div>

        <div className="section__open-source">
          <div className="section__open-source--text">
            <p className="title">Open Source Poker NFTs</p>
            <div className="desc">
              <p>
                The 52 cards and {MAX_TOTAL_SUPPLY} card pair NFTs are available
                for open source use.
              </p>
              <p>
                They can be used freely in any way.
                <br />
                For example, for private games, for Texas Hold’em with higher
                stakes, for different variants of poker such as Omaha Hold’em,
                or indeed for distinct card games such as Blackjack.
              </p>
              <p>
                While NFT games such as Axie Infinity have recently gained in
                popularity, a gap exists to serve casual gamers &amp; more
                traditional games.
                <br />
                The Holdem Heroes card deck fulfills this need by providing the
                cards and contracts to offer Poker as well as a plethora of
                other card games. These can be be played by thousands of people
                at the same time, who share in a common and accumulating
                jackpot.
              </p>
              <p>
                People can design their own card sets, games, betting systems
                and more...
              </p>
              <p>
                Please see the{" "}
                <a
                  href="https://docs.holdemheroes.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  documentation
                </a>{" "}
                for full details, as well as card provenance and proof of
                randomness.
              </p>
            </div>
          </div>
          <div className="section__open-source--img">
            <img src="../../assets/images/cardshq.png" alt="" />
          </div>
        </div>

        <div className="section__rest--wrapper">
          <div className="section__rest">
            <div className="game-play">
              <img
                src="../assets/images/tablehq.png"
                loading="lazy"
                srcSet="../assets/images/tablehq-p-1080.png 1080w, ../assets/images/tablehq-p-1600.png 1600w, ../assets/images/tablehq.png 1659w"
                sizes="(max-width: 479px) 100vw, (max-width: 767px) 90vw, (max-width: 991px) 650px, (max-width: 2765px) 60vw, 1659px"
                alt=""
              />
              <div className="game-play__text">
                <p className="title">Gameplay</p>
                <div className="desc">
                  <p>
                    Poker gameplay starts immediately after the NFT sale
                    concludes. We are proud to be one of few projects with NFT
                    gaming ready at time of launch.
                  </p>
                  <p>
                    In Holdem Heroes, every NFT is a pair of Hole Cards.
                    <br />
                    By owning an NFT, you hold these Hole Cards and can play
                    poker games with them.
                  </p>
                  <p>
                    Games take place on both the Ethereum and Polygon
                    blockchains, can start at any time, and include up to{" "}
                    {MAX_TOTAL_SUPPLY}
                    players.
                  </p>
                  <p>
                    You can choose your game duration, bet size, and play
                    multiple games in parallel.
                  </p>
                </div>
                <div className="game-play__btn-group">
                  <NavLink to="/Play" className="btn--play">
                    Play Now
                  </NavLink>
                  <NavLink to="/Rules" className="btn--learn">
                    Learn More
                  </NavLink>
                </div>
              </div>
            </div>

            <div className="roadmap--wrapper">
              <div className="roadmap__text">
                <p className="title">Roadmap</p>
                <p className="subtitle">MORE GAMES</p>
                <p className="desc">
                  Further games of poker and other card games with the
                  open-source card contract
                </p>
                <p className="subtitle">MORE CHAINS</p>
                <p className="desc">
                  Deploying games to EVM chains by community vote (AVAX, BSC,
                  Fantom...)
                </p>
                <p className="subtitle">MORE DECKS</p>
                <p className="desc">
                  Whitelisting card decks for custom-branded poker games
                </p>
                <p className="subtitle">GOVERNANCE BY DAO</p>
                <p className="desc">
                  Decentralizing governance to community ownership by
                  formalizing the DAO structure
                </p>
              </div>

              <div className="roadmap__img">
                <Roadmap />
              </div>
            </div>

            <div className="animation-btn-group">
              <AnimateButton>
                <a href="#section__nft-poker" rel="noreferrer">
                  Mint Poker Nfts
                </a>
              </AnimateButton>
              <AnimateButton>
                <a
                  href="https://discord.gg/dmgga7b72Y"
                  target="_blank"
                  rel="noreferrer"
                >
                  Join Our Community
                </a>
              </AnimateButton>
              <AnimateButton>
                <NavLink to="/Play">Play Hold&#x27;em Heroes</NavLink>
              </AnimateButton>
            </div>
          </div>

          <div className="vor--wrapper">
            <p>
              Powered by{" "}
              <a
                href="https://vor.unification.io"
                target="_blank"
                rel="noreferrer"
              >
                VOR (xFUND)
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
