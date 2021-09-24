import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder'
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import { FormattedMessage, injectIntl } from 'react-intl';

import { connect } from "react-redux";

class HowTo extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        const title = 'How it works';
        setTitle({ pageTitle: title })
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const { intl, display_mode } = this.props;
        return (
            <div className="col-in">
                <div className="how-it-works">
                    <h2>
                        How
                        <img src={display_mode == 'light' ? "/images/payperwin logo blue.png" : '/images/logo200.png'} style={{ width: 200, height: 49, margin: '0 15px', }}
                        />Works
                    </h2>
                    <div className="summary">
                        <p>PAYPER WIN is a Peer-to-Peer betting platform offering better odds by cutting out the bookie. No Juice, No Vig or House – just you vs. other bettors. Place bets on your favorite sports.</p>
                        <strong>RISK less and WIN More<i>!</i></strong>
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
                                <strong>PEER 2 PEER BETTING</strong>
                                <p>
                                    Here is where you beat the bookie. The odds are even and better than you will find anywhere else online. The only catch is you need some patience, you will need wait for peer to bet the opposite of you to make the bet complete. PAYPER WIN will take 3% from only the winner for facilitating the transaction and making sure you get paid. PAYPER WIN gurantees all winning bets will be paid. If patience isn't your virtue, say no more; we suggest doing a Instant bet.
                                </p>
                                <strong>Instant Bet/ Live bet</strong>
                                <p>
                                    Welcome, here is where you can bet instantly. Your bets do not need to wait for a peer to accept. These bets are instantly accepted. The only catch is that the odds are different than PEER 2 PEER. The bets here are forwarded on to a sportsbook. We are in no way affiliated with the sportsbooks.PAYPER WIN guarantees you will be paid on all winning bets. We have found the best sportsbook odds for you. PAYPER WIN does not profit off of or charge any fees whatsoever on live or instant bets. All live betting or non matching bets are done here such soccer draw bets and parlays.
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
                                    PAYPER WIN does not profit on these transactions or charges fees for won bets. Please keep in mind odds will be different and you are betting against a sportsbook and not peer.
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

const mapStateToProps = (state) => ({
    display_mode: state.frontend.display_mode,
});

export default connect(mapStateToProps, null)(injectIntl(HowTo))
