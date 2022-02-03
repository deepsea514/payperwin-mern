import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import { Button } from '@material-ui/core';
import dateformat from "dateformat";
import { FormattedMessage } from 'react-intl';
import { selfExclusion } from '../redux/services';

class SelfExcusion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            readMore: false,
            peorid: null,
            step: 1,
        }
    }

    componentDidMount() {
        const title = 'Self Exclusion';
        setTitle({ pageTitle: title })
    }

    onChoosePeorid = (evt, peorid) => {
        if (evt.target.checked)
            this.setState({ peorid: peorid })
    }

    next = (evt) => {
        evt.preventDefault();
        this.setState({ step: 2 });
    }

    selfExcusion = () => {
        const { peorid } = this.state;
        const { getUser } = this.props;
        selfExclusion(peorid)
            .then(() => {
                window.scrollTo(0, 0);
                getUser();
            })
    }

    render() {
        const { readMore, step } = this.state;
        const { user } = this.props;
        let selfExcluded = null;
        if (user &&
            user.roles.selfExcluded &&
            (new Date()).getTime() < (new Date(user.roles.selfExcluded)).getTime()
        ) {
            selfExcluded = dateformat(new Date(user.roles.selfExcluded), "mediumDate");
        }

        return (
            <div className="col-in">
                <h1 className="main-heading-in"><FormattedMessage id="PAGES.SELFEXCLUSION" /></h1>
                {user && selfExcluded && <p className="text-t"><i className="fa fa-info-circle"
                    aria-hidden={true} /><FormattedMessage id="PAGES.SELFEXCLUSION.TILL" value={{ selfExcluded }} />. </p>}
                {user && !selfExcluded && <div className="main-cnt redio-sec ml-3">
                    <p className="text-t text-dark"><i className="fa fa-info-circle"
                        aria-hidden={true}></i> <FormattedMessage id="PAGES.SELFEXCLUSION.BALANCENOTZERO" /> </p>
                    <p>
                        <FormattedMessage id="PAGES.SELFEXCLUSION.RECOMMEND" />
                    </p>

                    {readMore && <>
                        <p>
                            <FormattedMessage id="PAGES.SELFEXCLUSION.PASSED" />
                        </p>
                        <p>
                            <FormattedMessage id="PAGES.SELFEXCLUSION.WERECOMMEND" />
                            <ul>
                                <li>
                                    • <FormattedMessage id="PAGES.SELFEXCLUSION.WERECOMMEND_1" />
                                </li>
                                <li>
                                    • <FormattedMessage id="PAGES.SELFEXCLUSION.WERECOMMEND_2" />
                                </li>
                                <li>
                                    • <FormattedMessage id="PAGES.SELFEXCLUSION.WERECOMMEND_3" />
                                </li>
                            </ul>
                        </p>
                    </>}
                    <a className="read-more" style={{ cursor: 'pointer' }} onClick={() => this.setState({ readMore: !readMore })}>{readMore ? 'Read less' : 'Read more'} </a>

                    {step == 1 && <div>
                        <h4 className="h4"><FormattedMessage id="PAGES.SELFEXCLUSION.HOWLONG" /></h4>
                        <form onSubmit={this.next}>
                            <p>
                                <input type="radio" id="time-6-months"
                                    name="radio-group" required onChange={(evt) => this.onChoosePeorid(evt, '6 months')} />
                                <label htmlFor="time-6-months"><FormattedMessage id="PAGES.SELFEXCLUSION.6M" /></label>
                            </p>
                            <p>
                                <input type="radio" id="time-1-year"
                                    name="radio-group" required onChange={(evt) => this.onChoosePeorid(evt, '1 year')} />
                                <label htmlFor="time-1-year"><FormattedMessage id="PAGES.SELFEXCLUSION.1Y" /></label>
                            </p>
                            <p>
                                <input type="radio" id="time-3-years"
                                    name="radio-group" required onChange={(evt) => this.onChoosePeorid(evt, '3 years')} />
                                <label htmlFor="time-3-years"><FormattedMessage id="PAGES.SELFEXCLUSION.3Y" /></label>
                            </p>
                            <p>
                                <input type="radio" id="time-5-years"
                                    name="radio-group" required onChange={(evt) => this.onChoosePeorid(evt, '5 years')} />
                                <label htmlFor="time-5-years"><FormattedMessage id="PAGES.SELFEXCLUSION.5Y" /></label>
                            </p>
                            <p>
                                <input type="radio" id="time-permanent"
                                    name="radio-group" required onChange={(evt) => this.onChoosePeorid(evt, 'permanent')} />
                                <label htmlFor="time-permanent"><FormattedMessage id="PAGES.SELFEXCLUSION.PERMANENT" /></label>
                            </p>
                            {/* <button type="submit" className="btn-primary clr-t-l mar30">Next</button> */}
                            <Button type="submit" variant="contained" color="secondary">Next</Button>
                        </form>
                    </div>}
                    {step == 2 && <div>
                        <h4 className="h4"><FormattedMessage id="PAGES.SELFEXCLUSION.TERMS" /></h4>
                        <p>
                            <FormattedMessage id="PAGES.SELFEXCLUSION.TERMS_1" />
                        </p>
                        <p>
                            <FormattedMessage id="PAGES.SELFEXCLUSION.TERMS_2" />
                        </p>
                        <p>
                            <FormattedMessage id="PAGES.SELFEXCLUSION.TERMS_3" />
                        </p>
                        <p>
                            <FormattedMessage id="PAGES.SELFEXCLUSION.TERMS_4" />
                        </p>
                        <p>
                            <FormattedMessage id="PAGES.SELFEXCLUSION.TERMS_5" />
                        </p>
                        <p>
                            <FormattedMessage id="PAGES.SELFEXCLUSION.TERMS_6" />
                        </p>
                        <p>
                            <FormattedMessage id="PAGES.SELFEXCLUSION.TERMS_7" />
                        </p>
                        <p>
                            <FormattedMessage id="PAGES.SELFEXCLUSION.TERMS_8" />
                        </p>
                        <p>
                            <FormattedMessage id="PAGES.SELFEXCLUSION.TERMS_9" />
                        </p>
                        <p>
                            <FormattedMessage id="PAGES.SELFEXCLUSION.TERMS_10" />
                        </p>
                        <Button variant="contained" color="secondary" onClick={this.selfExcusion}>Confirm and Self-Exclusion</Button>
                    </div>}
                </div>}
            </div>
        );
    }
}

export default SelfExcusion;