import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import AutobetHistory from '../components/autobethistory';
import AutobetSummary from '../components/autobetsummary';
import axios from 'axios';
import { Preloader, ThreeDots } from 'react-preloader-icon';

const config = require('../../../config.json');
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appUrl;

class AutobetDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null,
            data: null
        };
        this._Mounted = false;
    }

    componentWillUnmount() {
        this._Mounted = false;
    }

    componentDidMount() {
        this._Mounted = true;
        setTitle({ pageTitle: 'Autobet Dashboard' });
        if (this.props.user) {
            this.getAutobetData();
        }
    }

    componentDidUpdate(prevPros) {
        const { user, history } = this.props;
        const { user: prevUser } = prevPros;
        if (user && !user.autobet) {
            history.push('/');
        }
        if (!prevUser && user) {
            this.getAutobetData();
        }
    }

    getAutobetData = () => {
        this._Mounted && this.setState({ loading: true });
        axios.get(`${serverUrl}/autobet`, { withCredentials: true })
            .then(({ data }) => {
                this._Mounted && this.setState({ loading: false, data });
            })
            .catch((error) => {
                console.log(error);
                this._Mounted && this.setState({ loading: false, error, data: null });
            })
    }

    render() {
        const { data, loading, error } = this.state;
        const { user } = this.props;

        return (
            <React.Fragment>
                <div className="col-in">
                    <h1 className="main-heading-in">Autobet Dashboard</h1>
                    <div className="main-cnt">
                        {loading && <center>
                            <Preloader use={ThreeDots}
                                size={100}
                                strokeWidth={10}
                                strokeColor="#F0AD4E"
                                duration={800} />
                        </center>}
                        {error && <p>Error...</p>}
                        {!loading && data && <div className="row">
                            <div className="col-md-7">
                                <AutobetHistory histories={data.histories} />
                            </div>
                            <div className="col-md-5">
                                <AutobetSummary user={user} />
                            </div>
                        </div>}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default AutobetDashboard;