import React, { PureComponent } from 'react';
import axios from 'axios';
import { setTitle } from '../libs/documentTitleBuilder'
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';

export default class HowTo extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        setTitle({ pageTitle: 'How It Works' });
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return (
            <div className="col-in">
                <div className="how-it-works">
                    <h2>
                        How
                        <img src="/images/payperwin logo blue.png" style={
                            {
                                width: 200,
                                height: 49,
                                margin: '0 15px',
                            }
                        }
                        />Works
                    </h2>
                    <div className="summary">
                        PAYPER WIN is a Peer-to-Peer betting platform offering better odds by cutting out the bookie. No Juice, No Vig or House – just you vs. other bettors. Place bets on your favorite sports.<br /><strong>RISK less and WIN More<i>!</i></strong>
                    </div>
                    <div className="how-it-works-steps">
                        <Carousel
                            arrows
                            dots
                            draggable
                        >
                            <img src="/images/Select Your Sport.png" />
                            <img src="/images/Choose Your Line.png" />
                            <img src="/images/Enter Your Stake.png" />
                            <img src="/images/Get Matched.png" />
                            <img src="/images/Get Paid.png" />
                        </Carousel>
                        <br />
                        <br />
                        <br />
                        <div>
                            <center><strong>Select Your Sport</strong></center>
                            <div className="how-it-works-info">
                                <p>
                                    Choose from MMA, Soccer, Basketball, Football, Baseball etc.
                            </p>
                            </div>
                        </div>
                        <div>
                            <center>
                                <strong>Choose Your Line</strong>
                            </center>
                            <div className="how-it-works-info">
                                <p>
                                    Place your bet! Once you determine which category you may then choose from the over, under, money line or point spread odds.
                                </p>
                                <strong>Peer-to-Peer</strong>
                                <p>
                                    All peer-to-peer bets are against another bettor with even odds. Payper win charges 3% transaction fee to the winner. These Bets you are able to WIN MORE and RISK LESS than betting against a bookie or sportsbook.
                                </p>
                                <strong>Live Betting</strong>
                                <p>
                                    All Live Betting is forwarded to a sportsbook; these odds are provided by the sportsbook. Payper Win will forward for bet for instant acceptance and will not charge any fees for this transaction.
                                </p>
                                <strong>Sportsbook Forwarding</strong>
                                <p>
                                    Your bet is forwarded to a sportsbook; these odds are provided by the sportsbook. Payper Win will forward for bet for instant acceptance and will not charge any fees for this transaction games.
                                </p>
                                <p>
                                    REMINDER: You may at anytime prior to your bet being matched, change your bet to an INSTANT BET. Once your bet is matched or changes to an instant bet, no future edits may be done to your bet.
                                </p>
                            </div>
                        </div>
                        <div>
                            <center>
                                <strong>Enter You Stake</strong>
                            </center>
                            <div className="how-it-works-info">
                                <p>
                                    There are two boxes in which you can enter an amount. Stake, where you can enter the amount you want to bet; or Win, where you can enter the amount you want to win. Once a bet is placed, funds will be removed from your wallet until the completed event result.
                                </p>
                            </div>
                        </div>
                        <div>
                            <center>
                                <strong>Get Matched</strong>
                            </center>
                            <div className="how-it-works-info">
                                <p>
                                    The next step is to have your bet matched with an opposing bettor, there are fours stages of match result:
                                </p>
                                <strong>Pending Match</strong>
                                <p>
                                    At this stage, your bet is awaiting an opposing bettor to place a bet against you. Not getting any action? Don’t worry, anytime during this stage you may change your bet to an INSTANT BET.
                                </p>
                                <strong>Accepted Match</strong>
                                <p>
                                    This stage is to notify you that your bet is accepted and a bettor has bet against you. The bet will begin when the event starts.
                                </p>
                                <strong>Partial Match</strong>
                                <p>
                                    This happens when a portion of your bet has been accepted and the remainder portion is awaiting acceptance.
                                    The remainder portion will be pending until an opposing bettor accepts your bet. This will remain in effect until the start of the event.
                                    If your pending portion is not accepted at event start time, the portion pending will be cancelled and reimbursed back to you. Once a bet is made, your bet cannot be cancelled or altered.
                                </p>
                                <strong>Instant Match</strong>
                                <p>
                                    After a bet is placed and awaiting matching you may at anytime prior to a matching, convert your bet to an INSTANT BET.
                                    An INSTANT BET is when we forward your bet to a sportsbook. We find competitive lines for you to accept, if you accept theses odds then your bet is instantly accepted.
                                    Payper Win does not profit on these transactions or charges fees for won bets. Please keep in mind odds will be different and you are betting against a sportsbook and not peer.
                                </p>
                            </div>
                        </div>
                        <div>
                            <center>
                                <strong>Get Paid</strong>
                            </center>
                            <div className="how-it-works-info">
                                <p>
                                    If your bet is successful, we will transfer your winnings directly to your PAYPER WIN account. The event result will determine whether you are paid, reimbursed or charged.
                                </p>
                                <p>
                                    <strong>Event Result</strong>
                                </p>
                                <p>
                                    <strong>Win Result:</strong> you will be paid after the event has taken place.
                                </p>
                                <p>
                                    <strong>Loss Result:</strong> your winnings will be transferred directly to the opposing bettor who has won.
                                </p>
                                <p>
                                    <strong>Cancelled Result:</strong> This is when the event is cancelled or the bet was unsuccessfully matched.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
