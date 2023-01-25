import ExplanationCard from '../../components/ExplanationCard';
import './style.scss';
import { MAX_TOTAL_SUPPLY } from "../../helpers/constant";

const GamePlay = () => {
    const lists = [
        {
            img: 'assets/images/hearticon.png',
            title: 'FLOP',
            desc: ['Anyone can start a game of Holdem Heroes. They choose the duration of round time, and the size of the Turn and River bets.',
                'By starting a game, the Flop cards are dealt and the clock is started.',
                `All ${MAX_TOTAL_SUPPLY} NFTs are included in the game to start.`]
        },
        {
            img: 'assets/images/clubicon.png',
            title: 'TURN',
            desc: ['To stay in the game for the Turn, players must place a bet of Ether for each NFT they wish to play with, within the round time.',
                'A separate bet transaction must be made for each NFT.<br />If the NFT contains a card already in the Flop, it cannot be included in the game.']
        },
        {
            img: 'assets/images/diamondicon.png',
            title: 'RIVER',
            desc: ['NFTs that bet in the Turn are eligible for the River.<br />To stay in the game for the River, players must place a further bet of Ether within the round time.',
                'As with the Turn, a separate bet transaction must be made for each NFT. And a bet cannot be made if the NFT contains a card already in the Turn.']
        },
        {
            img: 'assets/images/spadeicon.png',
            title: 'WINNING HANDS',
            desc: ['After the River is dealt, players must submit their final hand within the round time.<br />The hand must consist of 1 NFT (2 cards) that bet in the Flop and Turn, plus 3 of the 5 cards in the River.',
                'After the round time elapses, anyone can call the End Game function. This calculates the winners and makes the winnings Claimable.',
                '<b>Note:</b> Winners can Claim immediately after a game, or let their winnings accumulate to be Claimed at any later time.',
                'Again, any Hole Card NFT that includes an identical card in the River will be disqualified from that game.',
                'The order of winning hands follows the standard rules of Texas Hold’em:<br /><i>Royal Flush > Straight Flush > Four of a Kind > Full House > Flush > Straight > Three of a kind > Two Pair > Pair > High Card</i>',
                'Every game results in multiple winners, with all Ether that has been bet distributed as follows:<br />• 97.5 % to the Pot<br />• 2.5% to the House']
        },
        {
            img: 'assets/images/Component-6.png',
            title: 'POT DISTRIBUTION',
            desc: ['Every game of Holdem Heroes results in up to 11 hands on the Leaderboard that win a portion of the Pot.',
                '<b>The Leaderboard is comprised of:</b><br />• "Winners" - highest hand(s)<br />• "Runners Up" - second highest hand(s)',
                '<b>There is a maximum of 11 places on the Leaderboard.<br />There is a maximum of 2 Winners.<br />If more than 2 equal Winners submit their hands, the first 2 will qualify as Winners--others will be bumped down the Leaderboard.',
                'If more equal Runners Up than fit on the Leaderboard submit their hands, those first to submit will qualify as Runners Up.',
                '<b>The Pot is distributed as follows:</b>',
                '<i>If there is 1 Winner:</i><br />• 60 % of the Pot goes to the Winner<br />• 40 % of  the Pot is split evenly between up to 10 Runners Up',
                '<i>If there are 2 equal Winners:</i><br />• 70% of the Pot goes to the Winners (35% each)<br />• 30% of the Pot is split among up to 9 Runners Up',
                '<b>Edge cases:</b>',
                '<b>A) 2 winners but only 3 players</b><br />80% of the Pot goes to the 2 Winners (40% each)<br />20% of the Pot goes the single Runner Up',
                '<b>B) Only 2 players, both with equal hands</b><br />100% of the Pot goes to the Winners (50% each)']
        },
    ]
    return (
        <>
            <div className='explanation_card-wrapper'>
                {
                    lists.map((list, i) => <ExplanationCard key={i} attr={list} />)
                }
                <div className="vor--wrapper">
                    <p>Powered by <a href="https://vor.unification.io" target="_blank" rel="noreferrer">VOR (xFUND)</a></p>
                </div>
            </div>
        </>
    );
};

export default GamePlay;