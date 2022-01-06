import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import AutobetHistory from '../components/autobethistory';
import AutobetSummary from '../components/autobetsummary';
import AutobetChart from '../components/autobechart';
import AutobetHistoryTable from "../components/autobethistorytable"
import { Preloader, ThreeDots } from 'react-preloader-icon';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { FormattedMessage } from 'react-intl';
import { getAutobet } from '../redux/services';

class AutobetDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null,
            data: null,
            daterange: null,
            detail: null,
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
        getAutobet(daterange)
            .then(({ data }) => {
                this._Mounted && this.setState({ loading: false, data, detail: null });
            })
            .catch((error) => {
                this._Mounted && this.setState({ loading: false, error, data: null, detail: null });
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
        const { data, loading, error, daterange, detail } = this.state;
        const { user } = this.props;

        return (
            <React.Fragment>
                <div className="col-in">
                    <div className="my-3 ml-5 d-flex justify-content-between">
                        <span className="main-heading-in"><FormattedMessage id="PAGES.AUTOBET.DASHBOARD" /></span>
                        <div className="">
                            <DateRangePicker
                                initialSettings={daterange}
                                onApply={this.handleChangeDate}
                            >
                                <div className="rangepicker-container">
                                    <i className="fas fa-calendar-week"></i> <FormattedMessage id="PAGES.DATE_RANGE" />
                                </div>
                            </DateRangePicker>
                        </div>
                    </div>
                    {detail == null && <div className="main-cnt">
                        {loading && <center>
                            <Preloader use={ThreeDots}
                                size={100}
                                strokeWidth={10}
                                strokeColor="#F0AD4E"
                                duration={800} />
                        </center>}
                        {error && <p><FormattedMessage id="PAGES.LINE.ERROR" /></p>}
                        {!loading && data && <div className="row">
                            <div className="col-md-7">
                                <AutobetHistory histories={data.histories} />
                                <AutobetChart sports={data.sports} />
                            </div>
                            <div className="col-md-5">
                                <AutobetSummary
                                    user={user}
                                    summary={data.summary}
                                    setDetail={(detail) => this.setState({ detail: detail })}
                                />
                            </div>
                        </div>}
                    </div>}
                    {detail && <div className="main-cnt">
                        <AutobetHistoryTable
                            detail={detail}
                            cancel={() => this.setState({ detail: null })}
                            histories={data.histories} />
                    </div>}
                </div>
            </React.Fragment>
        );
    }
}

export default AutobetDashboard;