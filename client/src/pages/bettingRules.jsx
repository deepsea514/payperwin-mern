import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import { FormattedMessage } from 'react-intl';

class BettingRules extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMobile: null,
        }
    }

    componentDidMount() {
        const title = 'Betting Rules';
        setTitle({ pageTitle: title })
    }

    setVisible = (value) => {
        const { showMobile } = this.state;
        if (showMobile == value)
            this.setState({ showMobile: null });
        else
            this.setState({ showMobile: value });
    }

    render() {
        const { showMobile } = this.state;
        return (
            <React.Fragment>
                <div className="content-container">
                    <h1 className="title-bar background darkblue"><FormattedMessage id="PAGES.BETTING.RULES" /></h1>
                    <div className="block box">
                        <div className="containerless">
                            <article>
                                <div className="gray selection-list row">
                                    <ul className="col-4 list">
                                        <li>
                                            <a className="title" href="#General"><FormattedMessage id="PAGES.GENERAL.RULES" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Teasers"><FormattedMessage id="PAGES.TEASERS.RULES" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Glossary"><FormattedMessage id="PAGES.GLOSSARY" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#American-Football"><FormattedMessage id="PAGES.AMERICANFOOTBALL" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Athletics"><FormattedMessage id="PAGES.ATHLETICS" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Aussie-Rules"><FormattedMessage id="PAGES.AUSSIE.RULES" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Auto-Racing"><FormattedMessage id="PAGES.AUTORACING" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Badminton"><FormattedMessage id="PAGES.BADMINTON" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Bandy"><FormattedMessage id="PAGES.BANDY" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Baseball"><FormattedMessage id="PAGES.BASEBALL" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Basketball"><FormattedMessage id="PAGES.BASKETBALL" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Boxing-MMA"><FormattedMessage id="PAGES.BOXINGMMA" /></a>
                                        </li>
                                    </ul>

                                    <ul className="col-4 list">
                                        <li>
                                            <a className="title" href="#Cricket"><FormattedMessage id="PAGES.CRICKET" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Curling"><FormattedMessage id="PAGES.CURLING" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Cycling"><FormattedMessage id="PAGES.CYCLING" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Darts"><FormattedMessage id="PAGES.DARTS" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Esports"><FormattedMessage id="PAGES.ESPORTS" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Golf"><FormattedMessage id="PAGES.GOLF" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Handball"><FormattedMessage id="PAGES.HANDBALL" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Hockey"><FormattedMessage id="PAGES.HOCKEY" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Olympics"><FormattedMessage id="PAGES.OLYMPICS" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Poker"><FormattedMessage id="PAGES.POCKER" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Politics"><FormattedMessage id="PAGES.POLITICS" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Rugby"><FormattedMessage id="PAGES.RUGBY" /></a>
                                        </li>
                                    </ul>

                                    <ul className="col-4 list">
                                        <li>
                                            <a className="title" href="#Snooker"><FormattedMessage id="PAGES.SNOOKER" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Soccer"><FormattedMessage id="PAGES.SOCCER" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Sports-Simulations"><FormattedMessage id="PAGES.SPORTSSIMULATIONS" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Squash"><FormattedMessage id="PAGES.SQUASH" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Table-Tennis"><FormattedMessage id="PAGES.TABLETENNIS" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Tennis"><FormattedMessage id="PAGES.TENNIS" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Volleyball"><FormattedMessage id="PAGES.VOLLEYBALL" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Water-Polo"><FormattedMessage id="PAGES.WATERPOLO" /></a>
                                        </li>
                                        <li>
                                            <a className="title" href="#Winter-Sports"><FormattedMessage id="PAGES.WINTERSPORTS" /></a>
                                        </li>
                                    </ul>

                                    <div className="clear-both"></div>
                                </div>
                                <div className="rules gray" id="General">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.GENERAL.RULES" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(1)}>
                                        <FormattedMessage id="PAGES.GENERAL.RULES" />
                                        <div className="arrow-up" style={{ display: showMobile == 1 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 1 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 1 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.GENERAL.RULES.1" /></li>
                                            <li><FormattedMessage id="PAGES.GENERAL.RULES.2" />
                                                <ol>
                                                    <li><FormattedMessage id="PAGES.GENERAL.RULES.2.1" /></li>
                                                    <li><FormattedMessage id="PAGES.GENERAL.RULES.2.2" /></li>
                                                    <li><FormattedMessage id="PAGES.GENERAL.RULES.2.3" /></li>
                                                </ol>
                                            </li>
                                            <li><FormattedMessage id="PAGES.GENERAL.RULES.3" /></li>
                                            <li><FormattedMessage id="PAGES.GENERAL.RULES.4" /></li>
                                            <li><FormattedMessage id="PAGES.GENERAL.RULES.5" /></li>
                                            <li><FormattedMessage id="PAGES.GENERAL.RULES.6" /></li>
                                            <li><FormattedMessage id="PAGES.GENERAL.RULES.7" /></li>
                                            <li><FormattedMessage id="PAGES.GENERAL.RULES.8" /></li>
                                            <li><FormattedMessage id="PAGES.GENERAL.RULES.9" /></li>
                                            <li><FormattedMessage id="PAGES.GENERAL.RULES.10" /></li>
                                            <li><FormattedMessage id="PAGES.GENERAL.RULES.11" /></li>
                                            <li><FormattedMessage id="PAGES.GENERAL.RULES.12" /></li>
                                            <li><FormattedMessage id="PAGES.GENERAL.RULES.13" /></li>
                                            <li><FormattedMessage id="PAGES.GENERAL.RULES.14" /></li>
                                            <li><FormattedMessage id="PAGES.GENERAL.RULES.15" /></li>
                                            <li><FormattedMessage id="PAGES.GENERAL.RULES.16" /></li>
                                            <li><FormattedMessage id="PAGES.GENERAL.RULES.17" /></li>
                                            <li><FormattedMessage id="PAGES.GENERAL.RULES.18" /></li>
                                            <li><FormattedMessage id="PAGES.GENERAL.RULES.19" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="American-Football">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.AMERICANFOOTBALL" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(2)}>
                                        <FormattedMessage id="PAGES.AMERICANFOOTBALL" />
                                        <div className="arrow-up" style={{ display: showMobile == 2 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 2 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 2 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.AMERICANFOOTBALL.1" /></li>
                                            <li><FormattedMessage id="PAGES.AMERICANFOOTBALL.2" /></li>
                                            <li><FormattedMessage id="PAGES.AMERICANFOOTBALL.3" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES" /></strong></p>
                                        <ol >
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.1.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.1.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.2.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.2.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.3.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.3.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.4.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.4.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.5.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.5.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.6.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.6.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.7.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.7.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.8.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.8.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.9.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.9.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.10.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.10.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.11.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.11.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.12.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.12.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.13.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.13.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.14.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.14.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.15.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.15.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.16.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.16.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.17.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.17.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.18.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.18.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.19.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.19.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.20.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.20.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.21.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.21.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.22.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.22.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.23.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.23.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.24.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.24.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.25.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.25.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.26.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.26.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.27.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.27.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.28.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.28.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.29.1" /></strong>:<FormattedMessage id="PAGES.AMERICANFOOTBALL.MARRKETRULES.29.2" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Athletics">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.ATHLETICS" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(3)}>
                                        <FormattedMessage id="PAGES.ATHLETICS" />
                                        <div className="arrow-up" style={{ display: showMobile == 3 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 3 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 3 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><strong><FormattedMessage id="PAGES.ATHLETICS.1" />: </strong><FormattedMessage id="PAGES.ATHLETICS.2" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Aussie-Rules">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.AUSSIE.RULES" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(4)}>
                                        <FormattedMessage id="PAGES.AUSSIE.RULES" />
                                        <div className="arrow-up" style={{ display: showMobile == 4 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 4 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 4 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.AUSSIE.RULES.1" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Auto-Racing">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.AUTORACING" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(5)}>
                                        <FormattedMessage id="PAGES.AUTORACING" />
                                        <div className="arrow-up" style={{ display: showMobile == 5 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 5 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 5 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.AUTORACE.1" /></li>
                                            <li><FormattedMessage id="PAGES.AUTORACE.2" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.AUTORACE.MARKETRULES" /></strong></p>
                                        <ol >
                                            <li><strong><FormattedMessage id="PAGES.AUTORACE.MARKETRULES.1" />: </strong><FormattedMessage id="PAGES.AUTORACE.MARKETRULES.2" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Badminton">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.BADMINTON" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(6)}>
                                        <FormattedMessage id="PAGES.BADMINTON" />
                                        <div className="arrow-up" style={{ display: showMobile == 6 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 6 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 6 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.BADMINTON.1" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Bandy">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.BANDY" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(7)}>
                                        <FormattedMessage id="PAGES.BANDY" />
                                        <div className="arrow-up" style={{ display: showMobile == 7 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 7 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 7 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.BANDY.1" /></li>
                                            <li><FormattedMessage id="PAGES.BANDY.2" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Baseball">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.BASEBALL" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(8)}>
                                        <FormattedMessage id="PAGES.BASEBALL" />
                                        <div className="arrow-up" style={{ display: showMobile == 8 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 8 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 8 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.BASEBALL.1" /></li>
                                            <li><FormattedMessage id="PAGES.BASEBALL.2" /></li>
                                            <li><FormattedMessage id="PAGES.BASEBALL.3" /></li>
                                            <li><FormattedMessage id="PAGES.BASEBALL.4" /></li>
                                            <li><FormattedMessage id="PAGES.BASEBALL.5" /></li>
                                            <li><FormattedMessage id="PAGES.BASEBALL.6" /></li>
                                            <li><FormattedMessage id="PAGES.BASEBALL.7" /></li>
                                            <li><FormattedMessage id="PAGES.BASEBALL.8" /></li>
                                            <li><FormattedMessage id="PAGES.BASEBALL.9" />:
                                                <ol>
                                                    <li><FormattedMessage id="PAGES.BASEBALL.9.1" /></li>
                                                    <li><FormattedMessage id="PAGES.BASEBALL.9.2" /></li>
                                                    <li><FormattedMessage id="PAGES.BASEBALL.9.3" /></li>
                                                </ol>
                                            </li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.BASEBALL.MARKETRULES" /></strong></p>
                                        <ol >
                                            <li><strong><FormattedMessage id="PAGES.BASEBALL.MARKETRULES.1.1" /></strong>: <FormattedMessage id="PAGES.BASEBALL.MARKETRULES.1.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.BASEBALL.MARKETRULES.2.1" /></strong>: <FormattedMessage id="PAGES.BASEBALL.MARKETRULES.2.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.BASEBALL.MARKETRULES.3.1" /></strong>: <FormattedMessage id="PAGES.BASEBALL.MARKETRULES.3.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.BASEBALL.MARKETRULES.4.1" /></strong>: <FormattedMessage id="PAGES.BASEBALL.MARKETRULES.4.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.BASEBALL.MARKETRULES.5.1" /></strong>: <FormattedMessage id="PAGES.BASEBALL.MARKETRULES.5.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.BASEBALL.MARKETRULES.6.1" /></strong>: <FormattedMessage id="PAGES.BASEBALL.MARKETRULES.6.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.BASEBALL.MARKETRULES.7.1" /></strong>: <FormattedMessage id="PAGES.BASEBALL.MARKETRULES.7.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.BASEBALL.MARKETRULES.8.1" /></strong>: <FormattedMessage id="PAGES.BASEBALL.MARKETRULES.8.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.BASEBALL.MARKETRULES.9.1" /></strong>: <FormattedMessage id="PAGES.BASEBALL.MARKETRULES.9.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.BASEBALL.MARKETRULES.10.1" /></strong>: <FormattedMessage id="PAGES.BASEBALL.MARKETRULES.10.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.BASEBALL.MARKETRULES.11.1" /></strong>: <FormattedMessage id="PAGES.BASEBALL.MARKETRULES.11.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.BASEBALL.MARKETRULES.12.1" /></strong>: <FormattedMessage id="PAGES.BASEBALL.MARKETRULES.12.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.BASEBALL.MARKETRULES.13.1" /></strong>: <FormattedMessage id="PAGES.BASEBALL.MARKETRULES.13.2" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Basketball">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.BASKETBALL" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(9)}>
                                        <FormattedMessage id="PAGES.BASKETBALL" />
                                        <div className="arrow-up" style={{ display: showMobile == 9 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 9 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 9 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.BASKETBALL.1" /></li>
                                            <li><FormattedMessage id="PAGES.BASKETBALL.2" /></li>
                                            <li><FormattedMessage id="PAGES.BASKETBALL.3" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.BASKETBALL.MARKETRULES" /></strong></p>
                                        <ol >
                                            <li><strong><FormattedMessage id="PAGES.BASKETBALL.MARKETRULES.1.1" /></strong>: <FormattedMessage id="PAGES.BASKETBALL.MARKETRULES.1.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.BASKETBALL.MARKETRULES.2.1" /></strong>: <FormattedMessage id="PAGES.BASKETBALL.MARKETRULES.2.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.BASKETBALL.MARKETRULES.3.1" /></strong>: <FormattedMessage id="PAGES.BASKETBALL.MARKETRULES.3.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.BASKETBALL.MARKETRULES.4.1" /></strong>: <FormattedMessage id="PAGES.BASKETBALL.MARKETRULES.4.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.BASKETBALL.MARKETRULES.5.1" /></strong>: <FormattedMessage id="PAGES.BASKETBALL.MARKETRULES.5.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.BASKETBALL.MARKETRULES.6.1" /></strong>: <FormattedMessage id="PAGES.BASKETBALL.MARKETRULES.6.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.BASKETBALL.MARKETRULES.7.1" /></strong>: <FormattedMessage id="PAGES.BASKETBALL.MARKETRULES.7.2" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Boxing-MMA">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.BOXINGMMA" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(10)}>
                                        <FormattedMessage id="PAGES.BOXINGMMA" />
                                        <div className="arrow-up" style={{ display: showMobile == 10 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 10 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 10 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.BOXINGMMA.1" /></li>
                                            <li><FormattedMessage id="PAGES.BOXINGMMA.2" /></li>
                                            <li><FormattedMessage id="PAGES.BOXINGMMA.3" /></li>
                                            <li><FormattedMessage id="PAGES.BOXINGMMA.4" /></li>
                                            <li><FormattedMessage id="PAGES.BOXINGMMA.5" /></li>
                                            <li><FormattedMessage id="PAGES.BOXINGMMA.6" /></li>
                                            <li><FormattedMessage id="PAGES.BOXINGMMA.7" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.BOXING.MARKETRULES" /></strong></p>
                                        <ol >
                                            <li><strong><FormattedMessage id="PAGES.BOXING.MARKETRULES.1.1" /></strong>: <FormattedMessage id="PAGES.BOXING.MARKETRULES.1.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.BOXING.MARKETRULES.2.1" /></strong>: <FormattedMessage id="PAGES.BOXING.MARKETRULES.2.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.BOXING.MARKETRULES.3.1" /></strong>: <FormattedMessage id="PAGES.BOXING.MARKETRULES.3.2" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.MMA.MARKETRULES" /></strong></p>
                                        <ol >
                                            <li><strong><FormattedMessage id="PAGES.MMA.MARKETRULES.1.1" /></strong>: <FormattedMessage id="PAGES.MMA.MARKETRULES.1.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.MMA.MARKETRULES.2.1" /></strong>: <FormattedMessage id="PAGES.MMA.MARKETRULES.2.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.MMA.MARKETRULES.3.1" /></strong>: <FormattedMessage id="PAGES.MMA.MARKETRULES.3.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.MMA.MARKETRULES.4.1" /></strong>: <FormattedMessage id="PAGES.MMA.MARKETRULES.4.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.MMA.MARKETRULES.5.1" /></strong>: <FormattedMessage id="PAGES.MMA.MARKETRULES.5.2" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Cricket">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.CRICKET" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(11)}>
                                        <FormattedMessage id="PAGES.CRICKET" />
                                        <div className="arrow-up" style={{ display: showMobile == 11 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 11 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 11 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.CRICKET.1" /></li>
                                            <li><FormattedMessage id="PAGES.CRICKET.2" /></li>
                                            <li><FormattedMessage id="PAGES.CRICKET.3" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Curling">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.CURLING" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(12)}>
                                        <FormattedMessage id="PAGES.CURLING" />
                                        <div className="arrow-up" style={{ display: showMobile == 12 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 12 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 12 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.CURLING.1" /></li>
                                            <li><FormattedMessage id="PAGES.CURLING.2" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Cycling">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.CYCLING" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(13)}>
                                        <FormattedMessage id="PAGES.CYCLING" />
                                        <div className="arrow-up" style={{ display: showMobile == 13 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 13 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 13 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.CYCLING.1" /></li>
                                            <li><FormattedMessage id="PAGES.CYCLING.2" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.CYCLING.MARKETRULES" /></strong></p>
                                        <ol >
                                            <li><strong><FormattedMessage id="PAGES.CYCLING.MARKETRULES.1.1" />: </strong><FormattedMessage id="PAGES.CYCLING.MARKETRULES.1.2" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Darts">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.DARTS" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(14)}>
                                        <FormattedMessage id="PAGES.DARTS" />
                                        <div className="arrow-up" style={{ display: showMobile == 14 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 14 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 14 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.DARTS.1" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Esports">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.ESPORTS" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(15)}>
                                        <FormattedMessage id="PAGES.ESPORTS" />
                                        <div className="arrow-up" style={{ display: showMobile == 15 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 15 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 15 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.ESPORTS.1" /></li>
                                            <li><FormattedMessage id="PAGES.ESPORTS.2" /></li>
                                            <li><FormattedMessage id="PAGES.ESPORTS.3" /></li>
                                            <li><FormattedMessage id="PAGES.ESPORTS.4" /></li>
                                            <li><FormattedMessage id="PAGES.ESPORTS.5" /></li>
                                            <li><FormattedMessage id="PAGES.ESPORTS.6" /></li>
                                            <li><FormattedMessage id="PAGES.ESPORTS.7" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.RULES" /></strong></p>
                                        <p ><strong><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.CS" /></strong></p>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.CS.1" /></li>
                                            <li><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.CS.2" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.VALORANT" /></strong></p>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.VALORANT.1" /></li>
                                            <li><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.VALORANT.2" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.DOTA2" /></strong></p>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.DOTA2.1" /></li>
                                            <li><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.DOTA2.2" /></li>
                                            <li><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.DOTA2.3" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.KOG" /></strong></p>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.KOG.1" /></li>
                                            <li><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.KOG.2" /></li>
                                            <li><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.KOG.3" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.AOV" /></strong></p>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.AOV.1" /></li>
                                            <li><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.AOV.2" /></li>
                                            <li><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.AOV.3" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.HOT" /></strong></p>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.HOT.1" /></li>
                                            <li><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.HOT.2" /></li>
                                            <li><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.HOT.3" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.LOL" /></strong></p>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.LOL.1" /></li>
                                            <li><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.LOL.2" /></li>
                                            <li><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.LOL.3" /></li>
                                            <li><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.LOL.4" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.OVERWATCH" /></strong></p>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.OVERWATCH.1" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.RSIX" /></strong></p>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.RSIX.1" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.FORTNITE" /></strong></p>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.FORTNITE.1" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.PUBG" /></strong></p>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.PUBG.1" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.FREEFIRE" /></strong></p>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.ESPORTS.SUBSPORT.FREEFIRE.1" /></li>
                                        </ol>
                                        <p >&nbsp;</p>
                                        <p ><strong><FormattedMessage id="PAGES.ESPORTS.MARKETRULES" /></strong></p>
                                        <ol >
                                            <li><strong><FormattedMessage id="PAGES.ESPORTS.MARKETRULES.1.1" /></strong>: <FormattedMessage id="PAGES.ESPORTS.MARKETRULES.1.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.ESPORTS.MARKETRULES.2.1" /></strong>: <FormattedMessage id="PAGES.ESPORTS.MARKETRULES.2.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.ESPORTS.MARKETRULES.3.1" /></strong>: <FormattedMessage id="PAGES.ESPORTS.MARKETRULES.3.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.ESPORTS.MARKETRULES.4.1" /></strong>: <FormattedMessage id="PAGES.ESPORTS.MARKETRULES.4.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.ESPORTS.MARKETRULES.5.1" /></strong>: <FormattedMessage id="PAGES.ESPORTS.MARKETRULES.5.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.ESPORTS.MARKETRULES.6.1" /></strong>: <FormattedMessage id="PAGES.ESPORTS.MARKETRULES.6.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.ESPORTS.MARKETRULES.7.1" /></strong>: <FormattedMessage id="PAGES.ESPORTS.MARKETRULES.7.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.ESPORTS.MARKETRULES.8.1" /></strong>: <FormattedMessage id="PAGES.ESPORTS.MARKETRULES.8.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.ESPORTS.MARKETRULES.9.1" /></strong>: <FormattedMessage id="PAGES.ESPORTS.MARKETRULES.9.2" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Golf">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.GOLF" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(16)}>
                                        <FormattedMessage id="PAGES.GOLF" />
                                        <div className="arrow-up" style={{ display: showMobile == 16 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 16 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 16 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.GOLF.1" /></li>
                                            <li><FormattedMessage id="PAGES.GOLF.2" /></li>
                                            <li><FormattedMessage id="PAGES.GOLF.3" /></li>
                                            <li><FormattedMessage id="PAGES.GOLF.4" /></li>
                                            <li><FormattedMessage id="PAGES.GOLF.5" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.GOLF.MARKETRULE" /></strong></p>
                                        <ol >
                                            <li><strong><FormattedMessage id="PAGES.GOLF.MARKETRULE.1.1" /></strong>: <FormattedMessage id="PAGES.GOLF.MARKETRULE.1.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.GOLF.MARKETRULE.2.1" /></strong>: <FormattedMessage id="PAGES.GOLF.MARKETRULE.2.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.GOLF.MARKETRULE.3.1" /></strong>: <FormattedMessage id="PAGES.GOLF.MARKETRULE.3.2" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Handball">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.HANDBALL" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(17)}>
                                        <FormattedMessage id="PAGES.HANDBALL" />
                                        <div className="arrow-up" style={{ display: showMobile == 17 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 17 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 17 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.HANDBALL.1" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Hockey">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.HOCKEY" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(18)}>
                                        <FormattedMessage id="PAGES.HOCKEY" />
                                        <div className="arrow-up" style={{ display: showMobile == 18 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 18 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 18 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.HOCKEY.1" /></li>
                                            <li><FormattedMessage id="PAGES.HOCKEY.2" /></li>
                                            <li><FormattedMessage id="PAGES.HOCKEY.3" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.HOCKEY.MARKETRULES" /></strong></p>
                                        <ol >
                                            <li><strong><FormattedMessage id="PAGES.HOCKEY.MARKETRULES.1.1" /></strong>: <FormattedMessage id="PAGES.HOCKEY.MARKETRULES.1.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.HOCKEY.MARKETRULES.2.1" /></strong>: <FormattedMessage id="PAGES.HOCKEY.MARKETRULES.2.2" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Olympics">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.OLYMPICS" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(19)}>
                                        <FormattedMessage id="PAGES.OLYMPICS" />
                                        <div className="arrow-up" style={{ display: showMobile == 19 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 19 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 19 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.OLYMPICS.1" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.OLYMPICS.MARKETRULES" /></strong></p>
                                        <ol >
                                            <li><strong><FormattedMessage id="PAGES.OLYMPICS.MARKETRULES.1.1" /></strong>: <FormattedMessage id="PAGES.OLYMPICS.MARKETRULES.1.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.OLYMPICS.MARKETRULES.2.1" /></strong>: <FormattedMessage id="PAGES.OLYMPICS.MARKETRULES.2.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.OLYMPICS.MARKETRULES.3.1" /></strong>: <FormattedMessage id="PAGES.OLYMPICS.MARKETRULES.3.2" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Poker">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.POCKER" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(20)}>
                                        <FormattedMessage id="PAGES.POCKER" />
                                        <div className="arrow-up" style={{ display: showMobile == 20 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 20 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 20 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.POCKER.1" /></li>
                                            <li><FormattedMessage id="PAGES.POCKER.2" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.POCKER.MARKETRULES" /></strong></p>
                                        <ol >
                                            <li><strong><FormattedMessage id="PAGES.POCKER.MARKETRULES.1.1" /></strong>: <FormattedMessage id="PAGES.POCKER.MARKETRULES.1.2" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Politics">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.POLITICS" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(21)}>
                                        <FormattedMessage id="PAGES.POLITICS" />
                                        <div className="arrow-up" style={{ display: showMobile == 21 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 21 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 21 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.POLITICS.1" /></li>
                                            <li><FormattedMessage id="PAGES.POLITICS.2" /></li>
                                            <li><FormattedMessage id="PAGES.POLITICS.3" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Rugby">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.RUGBY" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(22)}>
                                        <FormattedMessage id="PAGES.RUGBY" />
                                        <div className="arrow-up" style={{ display: showMobile == 22 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 22 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 22 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.RUGBY.1" /></li>
                                            <li><FormattedMessage id="PAGES.RUGBY.2" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.RUGBY.MARKETRULES" /></strong></p>
                                        <ol >
                                            <li><strong><FormattedMessage id="PAGES.RUGBY.MARKETRULES.1.1" /></strong>: <FormattedMessage id="PAGES.RUGBY.MARKETRULES.1.2" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Snooker">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.SNOOKER" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(23)}>
                                        <FormattedMessage id="PAGES.SNOOKER" />
                                        <div className="arrow-up" style={{ display: showMobile == 23 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 23 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 23 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.SNOOKER.1" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Soccer">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.SOCCER" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(24)}>
                                        <FormattedMessage id="PAGES.SOCCER" />
                                        <div className="arrow-up" style={{ display: showMobile == 24 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 24 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 24 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.SOCCER.1" /></li>
                                            <li><FormattedMessage id="PAGES.SOCCER.2" /></li>
                                            <li><FormattedMessage id="PAGES.SOCCER.3" /></li>
                                            <li><FormattedMessage id="PAGES.SOCCER.4" /></li>
                                            <li><FormattedMessage id="PAGES.SOCCER.5" /></li>
                                            <li><FormattedMessage id="PAGES.SOCCER.6" /></li>
                                            <li><FormattedMessage id="PAGES.SOCCER.7" /></li>
                                            <li><FormattedMessage id="PAGES.SOCCER.8" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.SOCCER.MARKETRULES" /></strong></p>
                                        <ol >
                                            <li><strong><FormattedMessage id="PAGES.SOCCER.MARKETRULES.1.1" /></strong>: <FormattedMessage id="PAGES.SOCCER.MARKETRULES.1.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.SOCCER.MARKETRULES.2.1" /></strong>: <FormattedMessage id="PAGES.SOCCER.MARKETRULES.2.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.SOCCER.MARKETRULES.3.1" /></strong>: <FormattedMessage id="PAGES.SOCCER.MARKETRULES.3.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.SOCCER.MARKETRULES.4.1" /></strong>: <FormattedMessage id="PAGES.SOCCER.MARKETRULES.4.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.SOCCER.MARKETRULES.5.1" /></strong>: <FormattedMessage id="PAGES.SOCCER.MARKETRULES.5.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.SOCCER.MARKETRULES.6.1" /></strong>: <FormattedMessage id="PAGES.SOCCER.MARKETRULES.6.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.SOCCER.MARKETRULES.7.1" /></strong>: <FormattedMessage id="PAGES.SOCCER.MARKETRULES.7.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.SOCCER.MARKETRULES.8.1" /></strong>: <FormattedMessage id="PAGES.SOCCER.MARKETRULES.8.2" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Sports-Simulations">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.SPORTSSIMULATIONS" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(25)}>
                                        <FormattedMessage id="PAGES.SPORTSSIMULATIONS" />
                                        <div className="arrow-up" style={{ display: showMobile == 25 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 25 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 25 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.SPORTSSIMULATIONS.1" /></li>
                                            <li><FormattedMessage id="PAGES.SPORTSSIMULATIONS.2" /></li>
                                            <li><FormattedMessage id="PAGES.SPORTSSIMULATIONS.3" /></li>
                                            <li><FormattedMessage id="PAGES.SPORTSSIMULATIONS.4" /></li>
                                            <li><FormattedMessage id="PAGES.SPORTSSIMULATIONS.5" /></li>
                                            <li><FormattedMessage id="PAGES.SPORTSSIMULATIONS.6" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.SPORTSSIMULATIONS.SUBSPORTS.RULES" /></strong></p>
                                        <p ><strong><FormattedMessage id="PAGES.SPORTSSIMULATIONS.SUBSPORTS.1" /></strong></p>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.SPORTSSIMULATIONS.SUBSPORTS.1.1" /></li>
                                            <li><FormattedMessage id="PAGES.SPORTSSIMULATIONS.SUBSPORTS.1.2" /></li>
                                            <li><FormattedMessage id="PAGES.SPORTSSIMULATIONS.SUBSPORTS.1.3" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.SPORTSSIMULATIONS.SUBSPORTS.2" /></strong></p>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.SPORTSSIMULATIONS.SUBSPORTS.2.1" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.SPORTSSIMULATIONS.SUBSPORTS.3" /></strong></p>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.SPORTSSIMULATIONS.SUBSPORTS.3.1" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.SPORTSSIMULATIONS.SUBSPORTS.4" /></strong></p>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.SPORTSSIMULATIONS.SUBSPORTS.4.1" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.SPORTSSIMULATIONS.SUBSPORTS.5" /></strong></p>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.SPORTSSIMULATIONS.SUBSPORTS.5.1" /></li>
                                            <li><FormattedMessage id="PAGES.SPORTSSIMULATIONS.SUBSPORTS.5.2" /></li>
                                            <li><FormattedMessage id="PAGES.SPORTSSIMULATIONS.SUBSPORTS.5.3" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Squash">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.SQUASH" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(26)}>
                                        <FormattedMessage id="PAGES.SQUASH" />
                                        <div className="arrow-up" style={{ display: showMobile == 26 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 26 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 26 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.SQUASH.1" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Table-Tennis">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.TABLETENNIS" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(27)}>
                                        <FormattedMessage id="PAGES.TABLETENNIS" />
                                        <div className="arrow-up" style={{ display: showMobile == 27 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 27 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 27 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.TABLETENNIS.1" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Tennis">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.TENNIS" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(28)}>
                                        <FormattedMessage id="PAGES.TENNIS" />
                                        <div className="arrow-up" style={{ display: showMobile == 28 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 28 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 28 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.TENNIS.1" /></li>
                                            <li><FormattedMessage id="PAGES.TENNIS.2" /></li>
                                            <li><FormattedMessage id="PAGES.TENNIS.3" /></li>
                                            <li><FormattedMessage id="PAGES.TENNIS.4" /></li>
                                            <li><FormattedMessage id="PAGES.TENNIS.5" /></li>
                                            <li><FormattedMessage id="PAGES.TENNIS.6" /></li>
                                            <li><FormattedMessage id="PAGES.TENNIS.7" /></li>
                                            <li><FormattedMessage id="PAGES.TENNIS.8" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Volleyball">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.VOLLEYBALL" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(29)}>
                                        <FormattedMessage id="PAGES.VOLLEYBALL" />
                                        <div className="arrow-up" style={{ display: showMobile == 29 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 29 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 29 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.VOLLEYBALL.1" /></li>
                                            <li><FormattedMessage id="PAGES.VOLLEYBALL.2" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Water-Polo">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.WATERPOLO" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(30)}>
                                        <FormattedMessage id="PAGES.WATERPOLO" />
                                        <div className="arrow-up" style={{ display: showMobile == 30 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 30 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 30 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.WATERPOLO.1" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Winter-Sports">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.WINTERSPORTS" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(31)}>
                                        <FormattedMessage id="PAGES.WINTERSPORTS" />
                                        <div className="arrow-up" style={{ display: showMobile == 31 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 31 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 31 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.WINTERSPORTS.1" /></li>
                                        </ol>
                                        <p ><strong><FormattedMessage id="PAGES.WINTERSPORTS.SUBSPORTS.RULES" /></strong></p>
                                        <ol >
                                            <li><strong><FormattedMessage id="PAGES.WINTERSPORTS.SUBSPORTS.1.1" /></strong><FormattedMessage id="PAGES.WINTERSPORTS.SUBSPORTS.1.2" /></li>
                                            <li><strong><FormattedMessage id="PAGES.WINTERSPORTS.SUBSPORTS.2.1" /></strong><FormattedMessage id="PAGES.WINTERSPORTS.SUBSPORTS.2.2" /></li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="rules gray" id="Teasers">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.TEASERS.RULES" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(33)}>
                                        <FormattedMessage id="PAGES.TEASERS.RULES" />
                                        <div className="arrow-up" style={{ display: showMobile == 33 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 33 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 33 ? 'block' : 'none' }}>
                                        <ol >
                                            <li><FormattedMessage id="PAGES.TEASERS.RULES.1" /></li>
                                            <li><FormattedMessage id="PAGES.TEASERS.RULES.2" /></li>
                                            <li><FormattedMessage id="PAGES.TEASERS.RULES.3" /></li>
                                            <li><FormattedMessage id="PAGES.TEASERS.RULES.4" /></li>
                                            <li><FormattedMessage id="PAGES.TEASERS.RULES.5" /></li>
                                            <li><FormattedMessage id="PAGES.TEASERS.RULES.6" /></li>
                                            <li><FormattedMessage id="PAGES.TEASERS.RULES.7" /></li>
                                        </ol>
                                        <table width="0" className="teasers" >
                                            <tbody>
                                                <tr>
                                                    <td colSpan="4">
                                                        <p><FormattedMessage id="PAGES.TEASERS.TABLE.1.1" /></p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p><FormattedMessage id="PAGES.TEASERS.TABLE.1.2" /></p>
                                                    </td>
                                                    <td>
                                                        <p>4 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>4.5 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>5 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p><FormattedMessage id="PAGES.TEASERS.TABLE.1.3" /></p>
                                                    </td>
                                                    <td>
                                                        <p>4.5 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>5 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>5.5 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p><FormattedMessage id="PAGES.TEASERS.TABLE.1.4" /></p>
                                                    </td>
                                                    <td>
                                                        <p>6.5 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>7 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>7.5 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>2 <FormattedMessage id="PAGES.TEASERS.TABLE.SELECTIONS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>2</p>
                                                    </td>
                                                    <td>
                                                        <p>1.91</p>
                                                    </td>
                                                    <td>
                                                        <p>1.83</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>3 <FormattedMessage id="PAGES.TEASERS.TABLE.SELECTIONS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>2.8</p>
                                                    </td>
                                                    <td>
                                                        <p>2.6</p>
                                                    </td>
                                                    <td>
                                                        <p>2.5</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>4 <FormattedMessage id="PAGES.TEASERS.TABLE.SELECTIONS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>4</p>
                                                    </td>
                                                    <td>
                                                        <p>3.5</p>
                                                    </td>
                                                    <td>
                                                        <p>3</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>5 <FormattedMessage id="PAGES.TEASERS.TABLE.SELECTIONS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>5.5</p>
                                                    </td>
                                                    <td>
                                                        <p>5</p>
                                                    </td>
                                                    <td>
                                                        <p>4.5</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>6 <FormattedMessage id="PAGES.TEASERS.TABLE.SELECTIONS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>8</p>
                                                    </td>
                                                    <td>
                                                        <p>7</p>
                                                    </td>
                                                    <td>
                                                        <p>6</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table width="0" className="teasers" >
                                            <tbody>
                                                <tr>
                                                    <td colSpan="5">
                                                        <p><FormattedMessage id="PAGES.TEASERS.TABLE.2.1" /></p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td>
                                                        <p>6 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>6.5 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>7 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>7.5 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>2 <FormattedMessage id="PAGES.TEASERS.TABLE.TEAMS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>2</p>
                                                    </td>
                                                    <td>
                                                        <p>1.91</p>
                                                    </td>
                                                    <td>
                                                        <p>1.83</p>
                                                    </td>
                                                    <td>
                                                        <p>1.77</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>3 <FormattedMessage id="PAGES.TEASERS.TABLE.TEAMS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>2.8</p>
                                                    </td>
                                                    <td>
                                                        <p>2.6</p>
                                                    </td>
                                                    <td>
                                                        <p>2.5</p>
                                                    </td>
                                                    <td>
                                                        <p>-</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>4 <FormattedMessage id="PAGES.TEASERS.TABLE.TEAMS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>4</p>
                                                    </td>
                                                    <td>
                                                        <p>3.5</p>
                                                    </td>
                                                    <td>
                                                        <p>3</p>
                                                    </td>
                                                    <td>
                                                        <p>-</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>5 <FormattedMessage id="PAGES.TEASERS.TABLE.TEAMS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>5.5</p>
                                                    </td>
                                                    <td>
                                                        <p>5</p>
                                                    </td>
                                                    <td>
                                                        <p>4.5</p>
                                                    </td>
                                                    <td>
                                                        <p>-</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>6 <FormattedMessage id="PAGES.TEASERS.TABLE.TEAMS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>8</p>
                                                    </td>
                                                    <td>
                                                        <p>7</p>
                                                    </td>
                                                    <td>
                                                        <p>6</p>
                                                    </td>
                                                    <td>
                                                        <p>-</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table width="0" className="teasers" >
                                            <tbody>
                                                <tr>
                                                    <td colSpan="5">
                                                        <p><FormattedMessage id="PAGES.TEASERS.TABLE.3.1" /></p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td>
                                                        <p>6 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>6.5 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>7 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>7.5 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>2 <FormattedMessage id="PAGES.TEASERS.TABLE.TEAMS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>2.05</p>
                                                    </td>
                                                    <td>
                                                        <p>2</p>
                                                    </td>
                                                    <td>
                                                        <p>1.91</p>
                                                    </td>
                                                    <td>
                                                        <p>1.83</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table width="0" className="teasers" >
                                            <tbody>
                                                <tr>
                                                    <td colSpan="4">
                                                        <p><FormattedMessage id="PAGES.TEASERS.TABLE.4.1" /></p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td>
                                                        <p>6 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>6.5 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>7 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>2 <FormattedMessage id="PAGES.TEASERS.TABLE.TEAMS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>1.91</p>
                                                    </td>
                                                    <td>
                                                        <p>1.83</p>
                                                    </td>
                                                    <td>
                                                        <p>1.77</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>3 <FormattedMessage id="PAGES.TEASERS.TABLE.TEAMS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>2.6</p>
                                                    </td>
                                                    <td>
                                                        <p>2.4</p>
                                                    </td>
                                                    <td>
                                                        <p>2.2</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>4 <FormattedMessage id="PAGES.TEASERS.TABLE.TEAMS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>3.6</p>
                                                    </td>
                                                    <td>
                                                        <p>3.4</p>
                                                    </td>
                                                    <td>
                                                        <p>3</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>5 <FormattedMessage id="PAGES.TEASERS.TABLE.TEAMS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>5.5</p>
                                                    </td>
                                                    <td>
                                                        <p>5</p>
                                                    </td>
                                                    <td>
                                                        <p>4.5</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>6 <FormattedMessage id="PAGES.TEASERS.TABLE.TEAMS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>8</p>
                                                    </td>
                                                    <td>
                                                        <p>7</p>
                                                    </td>
                                                    <td>
                                                        <p>6</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table width="0" className="teasers" >
                                            <tbody>
                                                <tr>
                                                    <td colSpan="4">
                                                        <p><FormattedMessage id="PAGES.TEASERS.TABLE.5.1" /></p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td>
                                                        <p>6 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>6.5 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>7 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>2 <FormattedMessage id="PAGES.TEASERS.TABLE.TEAMS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>2</p>
                                                    </td>
                                                    <td>
                                                        <p>1.91</p>
                                                    </td>
                                                    <td>
                                                        <p>1.83</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table width="0" className="teasers" >
                                            <tbody>
                                                <tr>
                                                    <td colSpan="3">
                                                        <p><FormattedMessage id="PAGES.TEASERS.TABLE.6.1" /></p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td>
                                                        <p>7.5 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                    <td width="132"></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>2 <FormattedMessage id="PAGES.TEASERS.TABLE.TEAMS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>1.91</p>
                                                    </td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table width="0" className="teasers" >
                                            <tbody>
                                                <tr>
                                                    <td colSpan="3">
                                                        <p><FormattedMessage id="PAGES.TEASERS.TABLE.7.1" /></p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td>
                                                        <p>10 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>13 <FormattedMessage id="PAGES.TEASERS.TABLE.POINTS" /></p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>3 <FormattedMessage id="PAGES.TEASERS.TABLE.TEAMS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>1.77</p>
                                                    </td>
                                                    <td>
                                                        <p>-</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>4 <FormattedMessage id="PAGES.TEASERS.TABLE.TEAMS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>-</p>
                                                    </td>
                                                    <td>
                                                        <p>1.71</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table width="0" className="teasers" >
                                            <tbody>
                                                <tr>
                                                    <td colSpan="2">
                                                        <p><FormattedMessage id="PAGES.TEASERS.TABLE.8.1" /></p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td>
                                                        <p><FormattedMessage id="PAGES.TEASERS.TABLE.8.2" /></p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>2 <FormattedMessage id="PAGES.TEASERS.TABLE.TEAMS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>1.5</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>3 <FormattedMessage id="PAGES.TEASERS.TABLE.TEAMS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>1.83</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>4 <FormattedMessage id="PAGES.TEASERS.TABLE.TEAMS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>2.4</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>5 <FormattedMessage id="PAGES.TEASERS.TABLE.TEAMS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>3</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p>6 <FormattedMessage id="PAGES.TEASERS.TABLE.TEAMS" /></p>
                                                    </td>
                                                    <td>
                                                        <p>4</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="rules gray" id="Glossary">
                                    <h2 className="privacy-policy-section-title desktop" ><FormattedMessage id="PAGES.GLOSSARY" /></h2>
                                    <h2 className="privacy-policy-section-title accordion-toggle" onClick={() => this.setVisible(33)}>
                                        <FormattedMessage id="PAGES.GLOSSARY" />
                                        <div className="arrow-up" style={{ display: showMobile == 33 ? 'block' : 'none' }}></div>
                                        <div className="arrow-down" style={{ display: showMobile != 33 ? 'block' : 'none' }}></div>
                                    </h2>
                                    <div className="mobile-container" style={{ display: showMobile == 33 ? 'block' : 'none' }}>
                                        <p ><strong><FormattedMessage id="PAGES.GLOSSARY.1.1" /></strong>: <FormattedMessage id="PAGES.GLOSSARY.1.2" /></p>
                                        <p ><strong><FormattedMessage id="PAGES.GLOSSARY.2.1" /></strong>: <FormattedMessage id="PAGES.GLOSSARY.2.2" /></p>
                                        <p ><strong><FormattedMessage id="PAGES.GLOSSARY.3.1" /></strong>: <FormattedMessage id="PAGES.GLOSSARY.3.2" /></p>
                                        <p ><strong><FormattedMessage id="PAGES.GLOSSARY.4.1" /></strong>: <FormattedMessage id="PAGES.GLOSSARY.4.2" /></p>
                                        <p ><strong><FormattedMessage id="PAGES.GLOSSARY.5.1" /></strong>: <FormattedMessage id="PAGES.GLOSSARY.5.2" /></p>
                                        <p ><strong><FormattedMessage id="PAGES.GLOSSARY.6.1" /></strong>: <FormattedMessage id="PAGES.GLOSSARY.6.2" /></p>
                                        <p ><strong><FormattedMessage id="PAGES.GLOSSARY.7.1" /></strong>: <FormattedMessage id="PAGES.GLOSSARY.7.2" /></p>
                                        <p ><strong><FormattedMessage id="PAGES.GLOSSARY.8.1" /></strong>: <FormattedMessage id="PAGES.GLOSSARY.8.2" /></p>
                                        <p ><strong><FormattedMessage id="PAGES.GLOSSARY.9.1" /></strong>: <FormattedMessage id="PAGES.GLOSSARY.9.2" /></p>
                                        <p ><strong><FormattedMessage id="PAGES.GLOSSARY.10.1" /></strong>: <FormattedMessage id="PAGES.GLOSSARY.10.2" /></p>
                                        <p ><strong><FormattedMessage id="PAGES.GLOSSARY.11.1" /></strong>: <FormattedMessage id="PAGES.GLOSSARY.11.2" /></p>
                                        <p ><strong><FormattedMessage id="PAGES.GLOSSARY.12.1" /></strong>: <FormattedMessage id="PAGES.GLOSSARY.12.2" /></p>
                                        <p ><strong><FormattedMessage id="PAGES.GLOSSARY.13.1" /></strong>: <FormattedMessage id="PAGES.GLOSSARY.13.2" /></p>
                                        <p ><strong><FormattedMessage id="PAGES.GLOSSARY.14.1" /></strong>: <FormattedMessage id="PAGES.GLOSSARY.14.2" /></p>
                                        <p ><strong><FormattedMessage id="PAGES.GLOSSARY.15.1" /></strong>: <FormattedMessage id="PAGES.GLOSSARY.15.2" /></p>
                                        <p ><strong><FormattedMessage id="PAGES.GLOSSARY.16.1" /></strong>: <FormattedMessage id="PAGES.GLOSSARY.16.2" /></p>
                                        <p ><strong><FormattedMessage id="PAGES.GLOSSARY.17.1" /></strong>: <FormattedMessage id="PAGES.GLOSSARY.17.2" /></p>
                                    </div>
                                </div>
                                <a className="back-to-top rules" href="#page-top"><FormattedMessage id="PAGES.BACKTOTOP" /></a>
                            </article>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default BettingRules;