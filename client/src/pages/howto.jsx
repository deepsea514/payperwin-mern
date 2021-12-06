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
                        <FormattedMessage id="PAGES.HOWITWORKS.TITLE" values={{ image: <img src={dark_light == 'light' ? "/images/logo-blue.png" : '/images/ppw-white-xmas.png'} style={{ width: 200, height: 49, margin: '0 15px', }} /> }} />
                    </h2>
                    <div className="summary">
                        <p><FormattedMessage id="PAGES.HOWITWORKS.SUMMARY" /></p>
                        <strong><FormattedMessage id="PAGES.HOWITWORKS.SUBTITLE" /><i>!</i></strong>
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
                            <center><strong><FormattedMessage id="PAGES.HOWITWORKS.SELECTSPORT" /></strong></center>
                            <div className="how-it-works-info">
                                <p>
                                    <FormattedMessage id="PAGES.HOWITWORKS.SELECTSPORT.1" />
                                </p>
                            </div>
                        </div>
                        <div>
                            <center>
                                <strong><FormattedMessage id="PAGES.HOWITWORKS.CHOOSELINE" /></strong>
                            </center>
                            <div className="how-it-works-info">
                                <strong><FormattedMessage id="PAGES.HOWITWORKS.CHOOSELINE.1" /></strong>
                                <p>
                                    <FormattedMessage id="PAGES.HOWITWORKS.CHOOSELINE.1.1" />
                                </p>
                                <strong><FormattedMessage id="PAGES.HOWITWORKS.CHOOSELINE.2" /></strong>
                                <p>
                                    <FormattedMessage id="PAGES.HOWITWORKS.CHOOSELINE.2.1" />
                                </p>
                            </div>
                        </div>
                        <div>
                            <center>
                                <strong><FormattedMessage id="PAGES.HOWITWORKS.ENTERSTAKE" /></strong>
                            </center>
                            <div className="how-it-works-info">
                                <p>
                                    <FormattedMessage id="PAGES.HOWITWORKS.ENTERSTAKE.1" />
                                </p>
                            </div>
                        </div>
                        <div>
                            <center>
                                <strong><FormattedMessage id="PAGES.HOWITWORKS.GETMATCHED" /></strong>
                            </center>
                            <div className="how-it-works-info">
                                <p>
                                    <FormattedMessage id="PAGES.HOWITWORKS.GETMATCHED.SUMMARY" />
                                </p>
                                <strong><FormattedMessage id="PAGES.HOWITWORKS.GETMATCHED.1" /></strong>
                                <p>
                                    <FormattedMessage id="PAGES.HOWITWORKS.GETMATCHED.1.1" />
                                </p>
                                <strong><FormattedMessage id="PAGES.HOWITWORKS.GETMATCHED.2" /></strong>
                                <p>
                                    <FormattedMessage id="PAGES.HOWITWORKS.GETMATCHED.2.1" />
                                </p>
                                <strong><FormattedMessage id="PAGES.HOWITWORKS.GETMATCHED.3" /></strong>
                                <p>
                                    <FormattedMessage id="PAGES.HOWITWORKS.GETMATCHED.3.1" />
                                </p>
                                <strong><FormattedMessage id="PAGES.HOWITWORKS.GETMATCHED.4" /></strong>
                                <p>
                                    <FormattedMessage id="PAGES.HOWITWORKS.GETMATCHED.4.1" />
                                </p>
                            </div>
                        </div>
                        <div>
                            <center>
                                <strong><FormattedMessage id="PAGES.HOWITWORKS.GETPAID" /></strong>
                            </center>
                            <div className="how-it-works-info">
                                <p>
                                    <FormattedMessage id="PAGES.HOWITWORKS.GETPAID.SUMMARY" />
                                </p>
                                <p>
                                    <strong><FormattedMessage id="PAGES.HOWITWORKS.GETPAID.RESULT" /></strong>
                                </p>
                                <p>
                                    <strong><FormattedMessage id="PAGES.HOWITWORKS.GETPAID.RESULT.1.1" />:</strong> <FormattedMessage id="PAGES.HOWITWORKS.GETPAID.RESULT.1.2" />
                                </p>
                                <p>
                                    <strong><FormattedMessage id="PAGES.HOWITWORKS.GETPAID.RESULT.2.1" />:</strong> <FormattedMessage id="PAGES.HOWITWORKS.GETPAID.RESULT.2.2" />
                                </p>
                                <p>
                                    <strong><FormattedMessage id="PAGES.HOWITWORKS.GETPAID.RESULT.3.1" />:</strong> <FormattedMessage id="PAGES.HOWITWORKS.GETPAID.RESULT.3.2" />
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
    dark_light: state.frontend.dark_light,
});

export default connect(mapStateToProps, null)(injectIntl(HowTo))
