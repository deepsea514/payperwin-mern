import React, { PureComponent } from 'react';
import axios from 'axios';
import Iframe from 'react-iframe';
import { setMeta } from '../libs/documentTitleBuilder';
const config = require('../../../config.json');
const serverUrl = config.appUrl;

class SportsBook extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loginUrl: null,
            loading: false,
            showModal: false,
            metaData: null
        };
    }

    componentDidMount() {
        const title = 'Instant/Live Betting';
        setMeta(title, (metaData) => {
            this.setState({ metaData: metaData });
        })

        const { user } = this.props;
        if (user) {
            this.pinnacleLogin();
        }

        const preference = JSON.parse(localStorage.getItem('frontend-preference'));
        if (!preference || !preference.sportsbookModal) {
            setTimeout(() => {
                this.setState({ showModal: true });
            }, 1500);
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.user && this.props.user) {
            this.pinnacleLogin();
        }

        if (prevProps.user && !this.props.user) {
            this.pinnacleLogout();
        }
    }

    pinnacleLogin = () => {
        this.setState({ loading: true });
        axios.get(`${serverUrl}/getPinnacleLogin`, { withCredentials: true })
            .then(({ data }) => {
                const { loginInfo } = data;
                const { loginUrl } = loginInfo;
                // console.log(data);
                this.setState({ loading: false, loginUrl });
            })
            .catch(() => {
                console.log('error');
                this.setState({ loading: false, loginUrl: null });
            });
    }

    pinnacleLogout = () => {
        axios.get(`${serverUrl}/pinnacleLogout`, { withCredentials: true })
            .then(() => console.log("logout success"))
            .catch((err) => console.log("logout failed", err))
    }

    componentWillUnmount() {
        const { user } = this.props;
        if (user) {
            this.pinnacleLogout();
        }
    }

    dontShowModal = () => {
        this.setState({ showModal: false });
        let preference = JSON.parse(localStorage.getItem('frontend-preference'));
        if (!preference) {
            preference = {};
        }
        preference.sportsbookModal = true;
        localStorage.setItem('frontend-preference', JSON.stringify(preference));
    }

    render() {
        const { loginUrl, loading, showModal, metaData } = this.state;
        const { user } = this.props;

        return (
            <div className="row">
                {metaData && <DocumentMeta {...metaData} />}
                {showModal && <div className="modal confirmation">
                    <div className="background-closer" onClick={() => this.setState({ showModal: false })} />
                    <div className="col-in">
                        <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={() => this.setState({ showModal: false })} />
                        <div>
                            <b>Instant/Live Betting</b>
                            <hr />
                            <p>
                                Welcome, here is where you can bet instantly.
                                Your bets do not need to wait for a peer to accept.
                                These bets are instantly accepted.
                                The only catch is that the odds are different than PEER 2 PEER.
                                The bets here are forwarded on to a sportsbook.
                                We are in no way affiliated with the sportsbooks.
                                PAYPER WIN guarantees you will be paid on all winning bets.
                                We have found the best sportsbook odds for you.
                                PAYPER WIN does not profit off of or charge any fees whatsoever on live or instant bets.
                                All live betting or non matching bets are done here such soccer draw bets and parlays.
                            </p>
                            <div className="text-right">
                                <button className="form-button" onClick={this.dontShowModal}> Don't show again </button>
                                <button className="form-button ml-2" onClick={() => this.setState({ showModal: false })}> OK </button>
                            </div>
                        </div>
                    </div>
                </div>}
                {(() => {
                    if (user) {
                        if (loading)
                            return <div>Loading...</div>;
                        if (loginUrl == null)
                            return <div>Error getting sportsbook.</div>;
                        console.log('got Url');
                        return <Iframe url={loginUrl}
                            width="100%"
                            height="700px"
                            display="initial"
                            position="relative" />
                    }
                    console.log('default Url');
                    return <Iframe url="https://fv-e38l1jq.oreo88.com/en/"
                        width="100%"
                        height="700px"
                        display="initial"
                        position="relative" />
                })()}
            </div>
        );
    }
}

export default SportsBook;
