import React, { PureComponent } from 'react';
import axios from 'axios';
import Iframe from 'react-iframe';
import { setTitle } from '../libs/documentTitleBuilder';
const config = require('../../../config.json');
const serverUrl = config.appUrl;

class SportsBook extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loginUrl: null,
            loading: false,
        };
    }

    componentDidMount() {
        setTitle({ pageTitle: 'SportsBook' });
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


    render() {
        const { loginUrl, loading } = this.state;
        if (loading) {
            return <div>Loading...</div>;
        }
        if (loginUrl == null)
            return <div>Error getting sportsbook.</div>;

        return (
            <div className="row">
                <Iframe url={loginUrl}
                    width="100%"
                    height="700px"
                    display="initial"
                    position="relative" />
            </div>
        );
    }
}

export default SportsBook;
