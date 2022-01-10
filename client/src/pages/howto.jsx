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
        const { intl, dark_light } = this.props;
        return (
            <div className="col-in">
                <div className="how-it-works">
                    <h2>
                        <FormattedMessage id="PAGES.HOWITWORKS.TITLE" values={{ image: <img src={dark_light == 'light' ? "/images/logo-blue.png" : '/images/logo-white.png'} style={{ width: 200, height: 49, margin: '0 15px', }} /> }} />
                    </h2>
                    <div className="summary">
                        Payper Win Is a Peer to Peer Betting Exchange offering a platform with better odds than anywhere else online. We are not a Bookie or Sportsbook and we are not affiliated with any Sportsbook. Place bets on your favorite sporting events worldwide. RISK less and WIN More!
                    </div>
                    <div className="how-it-works-steps">
                        <div className="how-it-works-info">
                            <div className='d-inline-flex'>
                                <img src='/images/howto/select sport.png' />
                                <div className='how-it-works-steps-item'>
                                    <strong>01. Select Your Sporting Event or League</strong>
                                    <p>Choose from NBA, NFL, MMA, MLB, MLS and many more.</p>
                                </div>
                            </div>

                            <div className='d-inline-flex mt-4'>
                                <img src='/images/howto/bet type.png' />
                                <div className='how-it-works-steps-item'>
                                    <strong>02. Choose Your Bet Type</strong>
                                    <p>Choose from the Moneyline, Point Spread, and many more.</p>
                                </div>
                            </div>

                            <div className='d-inline-flex mt-4'>
                                <img src='/images/howto/amount.png' />
                                <div className='how-it-works-steps-item'>
                                    <strong>03. Enter Your Bet Amount</strong>
                                    <p>
                                        There are two boxes in which you can enter an amount.
                                        This is where you can enter the amount you want to bet or win.
                                        Once a bet is placed, funds will be removed from your wallet until the event or match is completed.
                                    </p>
                                </div>
                            </div>

                            <div className='d-inline-flex mt-4'>
                                <img src='/images/howto/connected.png' />
                                <div className='how-it-works-steps-item'>
                                    <strong>04. Get Matched</strong>
                                    <p>
                                        The next step is to have your bet matched with an opposing bettor, there are <a target="_blank" href='https://www.payperwin.com/faq/article/61db980f16beac53953e160c-what-are-the-different-bet-status'>fours different match results</a>.
                                    </p>
                                </div>
                            </div>

                            <div className='d-inline-flex mt-4'>
                                <img src='/images/howto/cash.png' />
                                <div className='how-it-works-steps-item'>
                                    <strong>05. Get Paid</strong>
                                    <p>
                                        If your bet is successful, your winnings will be reflected in your PAYPER WIN account.
                                        The event result will determine whether you are paid, reimbursed or charged.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="how-it-works-info">
                            <strong>Event Result</strong>
                            <br />
                            <p>
                                <span>Win Result: you will be paid after the event has taken place.</span><br />
                                <span>Loss Result: your winnings will be transferred directly to the opposing bettor who has won.</span><br />
                                <span>Cancelled Result: This is when the event is cancelled or the bet was unsuccessfully matched.</span><br />
                            </p>
                        </div>
                        <div className="how-it-works-info">
                            <strong>HIGH STAKER INSTANT BETTING</strong>
                            <br />
                            <p>
                                Welcome, here is where you can bet instantly.
                                Your bets do not need to wait for a peer to accept.
                                These bets are instantly accepted.
                                The only catch is that the odds are different than PEER to PEER.
                                The bets here are forwarded on to a High Staker.
                                The odds will be similar to a Sportsbooks odds.
                                We are in no way affiliated with a Sportsbook.
                                A High Staker is a high net worth individual or group willing to take all bets.
                                PAYPER WIN guarantees you will be paid on all winning bets and we have found the best odds for you.
                                PAYPER WIN does not profit off of or charge any fees whatsoever on live or instant bets.
                                All live betting or non matching bets are done here such soccer draw bets and parlays.
                                PAYPER WIN will take a 5% fee only from the HIGH STAKER, NOT from you if you are to bet against one.
                                You are charged no FEES whether you win or lose betting against a High Staker.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    dark_light: state.frontend.dark_light,
});

export default connect(mapStateToProps, null)(injectIntl(HowTo))
