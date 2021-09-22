import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import AutobetHistory from '../components/autobethistory';
import AutobetSummary from '../components/autobetsummary';
import AutobetChart from '../components/autobechart';
import axios from 'axios';
import { Preloader, ThreeDots } from 'react-preloader-icon';
import DateRangePicker from 'react-bootstrap-daterangepicker';

const config = require('../../../config.json');
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appUrl;

class AutobetDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null,
            data: null,
            daterange: null,
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
        const { daterange } = this.state;
        this._Mounted && this.setState({ loading: true });
        axios.get(`${serverUrl}/autobet`, { withCredentials: true, params: daterange })
            .then(({ data }) => {
                this._Mounted && this.setState({ loading: false, data });
            })
            .catch((error) => {
                console.log(error);
                this._Mounted && this.setState({ loading: false, error, data: null });
            })
    }

    handleChangeDate = async (event, picker) => {
        await this.setState({
            daterange: {
                startDate: picker.startDate._d,
                endDate: picker.endDate._d
            }
        });
        this.getAutobetData();
    }

    render() {
        const { data, loading, error, daterange } = this.state;
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
                                <AutobetChart sports={data.sports} />
                            </div>
                            <div className="col-md-5">
                                <DateRangePicker
                                    initialSettings={daterange}
                                    onApply={this.handleChangeDate}
                                >
                                    <div className="rangepicker-container">
                                        <a href="#"><i className="fas fa-calendar-week"></i> Date Range </a>
                                    </div>
                                </DateRangePicker>
                                <AutobetSummary user={user} summary={data.summary} />
                            </div>
                        </div>}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default AutobetDashboard;