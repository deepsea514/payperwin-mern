import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';

class AboutUs extends Component {
    componentDidMount() {
        setTitle({ pageTitle: 'About Us' });
    }

    render() {
        return (
            <div className="col-in">
                <div className="how-it-works">
                    <h2>About Us</h2>

                    <div className="how-it-works-steps">
                        <div className='how-it-works-info'>
                            <p>
                                PAYPER WIN is a Peer to Peer Betting Exchange offering a platform with better odds than anywhere else online.
                                We are not a Bookie or Sportsbook, and we are not affiliated with any.
                                Payper Win prides itself providing a model where fans <i>RISK Less and WIN More!</i>
                            </p>
                            <p>
                                What does it mean to risk less and win more?
                                Because our odds are better than anywhere else, with us; you risk less betting with the favorite and you win more betting with the underdog.
                            </p>
                            <p>
                                Payper Win started in November 2014 as a paid pick service.
                                Payper Win would provide picks for sports betting, a bettting pick is a suggestion given by a picker, handicapper or expert with knowledge in sports betting industry.
                                Payper Win’s model was to only get paid “per win” on the picks provided.
                                Typically picks are sold, but we were paid only on successful outcomes of our winning suggestion.
                            </p>
                            <p>
                                The companys founder had knowledge and experience in the secondary ticket industry which goes hand in hand with sporting events.
                                The Scalper selling tickets in a dark alley soon became a storefront Ticket Broker with a website, compared to the Bookie sometimes depicted in a back room of a deli shop to eventually graduating to a Sportsbook website.
                                It was meshing concepts from these already linked industry’s into what is now Payper Win.
                                The business model eventually began its transition to a Peer to Peer Betting Exchange January 29th 2021.
                            </p>
                            <p>
                                Ticket Brokers would choose the mark up they wanted on a ticket based on supply and demand.
                                Similarly, how a Sportsbook would set it odds or lines for a bet.
                                Stubhub inspired the creation of the Peer to Peer model for Payper Win.
                            </p>
                            <p>
                                What is a Peer to Peer?
                                A Peer to Peer is where you bet against a person rather than with a Sportsbook or Bookie.
                                Stubhubs concept is buyers and sellers bypassing Ticket Brokers to exchange their tickets, Stubhub charges a fee for facilitating payments and tickets between both individuals.
                                Payper Win is a Exchange to bypass a Bookie and bet against another bettor.
                                The site officially launched August 17th 2021.
                            </p>
                            <p>
                                Its concept is a transaction based service site versus the norm of betting with a Sportsbook or Bookie.
                                Payper Win takes a small five percent fee from the winner for facilitating the transaction between both individuals.
                                After deducting Payper Wins transaction fee from the winner, the winner still sees a higher profit than betting with a Sportsbook.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AboutUs;