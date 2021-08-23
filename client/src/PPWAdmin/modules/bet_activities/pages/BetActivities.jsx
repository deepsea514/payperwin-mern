import React, { createRef } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import * as bet_activities from "../redux/reducers";
import dateformat from "dateformat";
import { getSports, getWagerActivityAsCSV } from "../redux/services";
import CustomPagination from "../../../components/CustomPagination.jsx";
import { CSVLink } from 'react-csv';
import CustomDatePicker from "../../../../components/customDatePicker";

class BetActivities extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 25,
            wagerActivityDownloadData: []
        }
        this.csvRef = createRef();
    }

    componentDidMount() {
        const { getBetActivities, getSportsSuccess } = this.props
        getBetActivities();
        getSports().then(({ data }) => {
            getSportsSuccess(data);
        })
    }

    onFilterChange = (filter) => {
        this.props.filterBetActivitiesChange(filter);
    }

    getDateFormat = (date) => {
        return dateformat(new Date(date), "yyyy-mm-dd HH:MM");
    }

    tableBody = () => {
        const { bet_activities, loading, filter } = this.props;

        if (filter.house == '' || filter.house == 'ppw') {
            if (loading) {
                return (
                    <tr>
                        <td colSpan="12" align="center">
                            <Preloader use={ThreeDots}
                                size={100}
                                strokeWidth={10}
                                strokeColor="#F0AD4E"
                                duration={800} />
                        </td>
                    </tr>
                );
            }
            if (bet_activities.length == 0) {
                return (
                    <tr>
                        <td colSpan="12" align="center">
                            <h3>No Bet Activities</h3>
                        </td>
                    </tr>
                );
            }

            return bet_activities.map((bet, index) => (
                <tr key={index}>
                    <td scope="col">{index + 1}</td>
                    <td scope="col">{this.getDateFormat(bet.createdAt)}</td>
                    <td scope="col">{bet.bet} {bet.userId ? bet.userId.currency : null}</td>
                    <td scope="col">{Number(bet.pickOdds).toFixed(2)}</td>
                    <td scope="col">{bet.userId ? bet.userId.email : null}</td>
                    <td scope="col">{bet.origin == 'other' ? 'Other' : bet.lineQuery.sportName}</td>
                    <td scope="col">{bet.origin == 'other' ? bet.lineQuery.eventName : `${bet.teamA.name} vs ${bet.teamB.name}`}</td>
                    <td scope="col">{this.getPPWBetDogFav(bet)}</td>
                    <td scope="col" style={{ textTransform: "uppercase" }}>{this.getPPWBetType(bet.origin == 'other' ? 'moneyline' : bet.lineQuery.type)}</td>
                    <td scope="col"><span className="label label-lg label-success label-inline font-weight-lighter mr-2">PPW</span></td>
                    <td scope="col">{this.getPPWBetStatus(bet.status)}</td>
                    <td scope="col">{this.getPPWBetMatch(bet.status)}</td>
                    <td scope="col">{this.getPPWWinLoss(bet)}</td>
                    <td scope="col">{bet.transactionID}</td>
                    <td scope="col">
                        <DropdownButton title="Actions">
                            <Dropdown.Item as={Link} to={`/${bet._id}/detail`}>
                                <i className="far fa-eye"></i>&nbsp; Detail
                            </Dropdown.Item>
                        </DropdownButton>
                    </td>
                </tr>
            ));
        }

        if (filter.house == 'pinnacle') {
            if (loading) {
                return (
                    <tr>
                        <td colSpan="11" align="center">
                            <Preloader use={ThreeDots}
                                size={100}
                                strokeWidth={10}
                                strokeColor="#F0AD4E"
                                duration={800} />
                        </td>
                    </tr>
                );
            }
            if (bet_activities.length == 0) {
                return (
                    <tr>
                        <td colSpan="11" align="center">
                            <h3>No Bet Activities</h3>
                        </td>
                    </tr>
                );
            }

            return bet_activities.map((bet, index) => (
                <tr key={index}>
                    <td scope="col">{index + 1}</td>
                    <td scope="col">{this.getDateFormat(bet.createdAt)}</td>
                    <td scope="col">{Number(bet.WagerInfo.ToRisk).toFixed(2)} {bet.userId.currency}</td>
                    <td scope="col">{Number(bet.WagerInfo.Odds).toFixed(2)} ({bet.WagerInfo.OddsFormat == 1 ? 'decimal' : 'american'})</td>
                    <td scope="col">{bet.userId.email}</td>
                    <td scope="col">{bet.WagerInfo.Sport}</td>
                    <td scope="col">{
                        bet.WagerInfo.Legs ?
                            bet.WagerInfo.Legs.map(leg => {
                                return <p key={leg.EventName}>{leg.EventName}</p>
                            }) :
                            bet.WagerInfo.EventName
                    }</td>
                    <td scope="col" style={{ textTransform: "uppercase" }}>{this.getPinnacleBetType(bet.WagerInfo.Type)}</td>
                    <td scope="col"><span className="label label-lg label-info label-inline font-weight-lighter mr-2">Pinnacle</span></td>
                    <td scope="col">{this.getPInnacleBetStatus(bet.Name)}</td>
                    <td scope="col">{this.getPinnacleWinLoss(bet)}</td>
                    <td scope="col">{bet.WagerInfo.WagerId}</td>
                    <td scope="col">
                        <DropdownButton title="Actions">
                            <Dropdown.Item as={Link} to={`/${bet._id}/detail`}>
                                <i className="far fa-eye"></i>&nbsp; Detail
                            </Dropdown.Item>
                        </DropdownButton>
                    </td>
                </tr>
            ));
        }
    }

    getPPWBetDogFav = (bet) => {
        const { teamA, teamB, pick } = bet;
        if (!teamA) return;
        if ((Number(teamA.odds) < Number(teamB.odds)) && pick == 'home' || (Number(teamA.odds) > Number(teamB.odds)) && pick == 'away') {
            return <span className="label label-lg label-outline-success label-inline font-weight-lighter mr-2">Favorite</span>
        }
        return <span className="label label-lg label-outline-warning label-inline font-weight-lighter mr-2">Underdog</span>
    }

    getPinnacleBetType = (type) => {
        switch (type.toLowerCase()) {
            case "single":
                return <span className="label label-lg label-light-danger label-inline font-weight-lighter mr-2">{type}</span>
            case "parlay":
                return <span className="label label-lg label-light-info label-inline font-weight-lighter mr-2">{type}</span>
            case "teaser":
            default:
                return <span className="label label-lg label-light-success label-inline font-weight-lighter mr-2">{type}</span>
        }
    }

    getPPWBetType = (type) => {
        switch (type) {
            case "moneyline":
                return <span className="label label-lg label-light-danger label-inline font-weight-lighter mr-2">{type}</span>
            case "spread":
                return <span className="label label-lg label-light-info label-inline font-weight-lighter mr-2">{type}</span>
            case "total":
            default:
                return <span className="label label-lg label-light-success label-inline font-weight-lighter mr-2">{type}</span>
        }
    }

    getPPWBetStatus = (status) => {
        switch (status) {
            case "Pending":
                return <span className="label label-lg label-light-danger label-inline font-weight-lighter mr-2">Pending</span>
            case "Partial Match":
                return <span className="label label-lg label-light-warning label-inline font-weight-lighter mr-2">Partial&nbsp;Match</span>
            case "Matched":
                return <span className="label label-lg label-light-success label-inline font-weight-lighter mr-2">Matched</span>
            case "Cancelled":
                return <span className="label label-lg label-light-info label-inline font-weight-lighter mr-2">Cancelled</span>
            case "Settled - Lose":
                return <span className="label label-lg label-danger label-inline font-weight-lighter mr-2">Lose</span>
            case "Settled - Win":
            default:
                return <span className="label label-lg label-success label-inline font-weight-lighter mr-2">Win</span>
        }
    }

    getPInnacleBetStatus = (status) => {
        switch (status) {
            case "BETTED":
                return <span className="label label-lg label-light-info label-inline font-weight-lighter mr-2">BETTED</span>
            case "ACCEPTED":
                return <span className="label label-lg label-light-primary label-inline font-weight-lighter mr-2">ACCEPTED</span>
            case "SETTLED":
                return <span className="label label-lg label-light-success label-inline font-weight-lighter mr-2">SETTLED</span>
            case "CANCELLED":
                return <span className="label label-lg label-danger label-inline font-weight-lighter mr-2">SETTLED</span>
            case "REJECTED":
                return <span className="label label-lg label-light-danger label-inline font-weight-lighter mr-2">REJECTED</span>
            case "ROLLBACKED":
                return <span className="label label-lg label-light-warning label-inline font-weight-lighter mr-2">ROLLBACKED</span>
            case "UNSETTLED":
            default:
                return <span className="label label-lg label-warning label-inline font-weight-lighter mr-2">UNSETTLED</span>
        }
    }

    getPPWBetMatch = (status) => {
        switch (status) {
            case "Pending":
            case "Partial Match":
            case "Matched":
                return <span className="label label-lg label-info label-inline font-weight-lighter mr-2">Open</span>
            case "Cancelled":
            case "Settled - Lose":
            case "Settled - Win":
            default:
                return <span className="label label-lg label-success label-inline font-weight-lighter mr-2">Settled</span>
        }
    }

    getPPWWinLoss = (bet) => {
        switch (bet.status) {
            case "Settled - Lose":
                return `- $${bet.bet.toFixed(2)} CAD`;
            case "Settled - Win":
                return `+ $${bet.payableToWin.toFixed(2)} CAD`
            case "Pending":
            case "Partial Match":
            case "Matched":
            case "Cancelled":
            default:
                return "$0 CAD";
        }
    }

    getPinnacleWinLoss = (bet) => {
        switch (bet.Name) {
            case "SETTLED":
                if (bet.WagerInfo.Outcome == "LOSE")
                    return `- $${(-Number(bet.WagerInfo.ProfitAndLoss)).toFixed(2)} CAD`;
                return `+ ${Number(bet.WagerInfo.ProfitAndLoss).toFixed(2)} CAD`
            case "BETTED":
            case "ACCEPTED":
            case "CANCELLED":
            case "REJECTED":
            case "ROLLBACKED":
            case "UNSETTLED":
            default:
                return "$0 CAD";
        }
    }

    onPageChange = (page) => {
        const { getBetActivities, currentPage } = this.props;
        if (page != currentPage)
            getBetActivities(page);
    }

    renderSports = () => {
        const { sports } = this.props;
        return sports.map((sport) => <option key={sport._id} value={sport.originSportId}>{sport.name}</option>)
    }

    downloadCSV = () => {
        const { filter } = this.props;
        getWagerActivityAsCSV(filter)
            .then(async ({ data }) => {
                await this.setState({ wagerActivityDownloadData: data });
                this.csvRef.current.link.click();
            })
    }

    render() {
        const { perPage, wagerActivityDownloadData } = this.state;
        const { total, currentPage, filter } = this.props;
        const totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;

        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Bet Activities</h3>
                            </div>
                            <div className="card-toolbar">
                                <CSVLink
                                    data={wagerActivityDownloadData}
                                    filename='wager-report.csv'
                                    className='hidden'
                                    ref={this.csvRef}
                                    target='_blank'
                                />
                                <button className="btn btn-success font-weight-bolder font-size-sm" onClick={this.downloadCSV}>
                                    <i className="fas fa-download"></i>&nbsp; Download as CSV
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="form-group row">
                                <div className="col-lg-2 col-md-3">
                                    <CustomDatePicker
                                        className="form-control"
                                        placeholderText="Search"
                                        selected={filter.datefrom ? new Date(filter.datefrom) : null}
                                        onChange={date => {
                                            this.onFilterChange({ datefrom: date });
                                        }} />
                                    <small className="form-text text-muted">
                                        <b>Search</b> From
                                    </small>
                                </div>
                                <div className="col-lg-2 col-md-3">
                                    <CustomDatePicker
                                        className="form-control"
                                        placeholderText="Search"
                                        selected={filter.dateto ? new Date(filter.dateto) : null}
                                        onChange={date => {
                                            this.onFilterChange({ dateto: date });
                                        }} />
                                    <small className="form-text text-muted">
                                        <b>Search</b> To
                                    </small>
                                </div>
                                <div className="col-lg-2 col-md-3">
                                    <select
                                        className="form-control"
                                        value={filter.sport}
                                        disabled={filter.house == 'pinnacle'}
                                        onChange={e => {
                                            this.onFilterChange({ sport: e.target.value });
                                        }} >
                                        <option value="">Choose Sport...</option>
                                        {this.renderSports()}
                                    </select>
                                    <small className="form-text text-muted">
                                        <b>Search</b> by Sports
                                    </small>
                                </div>
                                <div className="col-lg-2 col-md-3">
                                    <select
                                        className="form-control"
                                        value={filter.match}
                                        disabled={filter.house == 'pinnacle'}
                                        onChange={e => {
                                            this.onFilterChange({ match: e.target.value });
                                        }} >
                                        <option value="">Choose Match Status...</option>
                                        <option value="pending">Pending</option>
                                        <option value="matched">Matched</option>
                                    </select>
                                    <small className="form-text text-muted">
                                        <b>Search</b> by Match Status
                                    </small>
                                </div>
                                <div className="col-lg-2 col-md-3">
                                    <select
                                        className="form-control"
                                        value={filter.status}
                                        onChange={e => {
                                            this.onFilterChange({ status: e.target.value });
                                        }} >
                                        <option value="">Choose Match Status...</option>
                                        <option value="open">Open</option>
                                        <option value="settled">Settled</option>
                                    </select>
                                    <small className="form-text text-muted">
                                        <b>Search</b> by Status
                                    </small>
                                </div>
                                <div className="col-lg-2 col-md-3">
                                    <select
                                        className="form-control"
                                        value={filter.house}
                                        onChange={e => {
                                            this.onFilterChange({ house: e.target.value });
                                        }} >
                                        <option value="ppw">PPW</option>
                                        <option value="pinnacle">Pinnacle</option>
                                    </select>
                                    <small className="form-text text-muted">
                                        <b>Search</b> by House
                                    </small>
                                </div>
                                <div className="col-lg-2 col-md-3">
                                    <input
                                        type="number"
                                        value={filter.minamount}
                                        className="form-control"
                                        name="searchMaxAmount"
                                        placeholder="Search"
                                        onChange={(e) => {
                                            this.onFilterChange({ minamount: e.target.value });
                                        }}
                                    />
                                    <small className="form-text text-muted">
                                        <b>Search</b> by Min Amount
                                    </small>
                                </div>
                                <div className="col-lg-2 col-md-3">
                                    <input
                                        type="number"
                                        value={filter.maxamount}
                                        className="form-control"
                                        name="searchMaxAmount"
                                        placeholder="Search"
                                        onChange={(e) => {
                                            this.onFilterChange({ maxamount: e.target.value });
                                        }}
                                    />
                                    <small className="form-text text-muted">
                                        <b>Search</b> by Max Amount
                                    </small>
                                </div>
                            </div>
                            <div className="">
                                <table className="table">
                                    <thead>
                                        {filter.house == "ppw" && <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Odds</th>
                                            <th scope="col">User</th>
                                            <th scope="col">Sport</th>
                                            <th scope="col">Event</th>
                                            <th scope="col">Dog/Fav</th>
                                            <th scope="col">Line</th>
                                            <th scope="col">House</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Match</th>
                                            <th scope="col">Win/Loss Amount</th>
                                            <th scope="col">TransactionID</th>
                                            <th scope="col"></th>
                                        </tr>}
                                        {filter.house == "pinnacle" && <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Odds</th>
                                            <th scope="col">User</th>
                                            <th scope="col">Sport</th>
                                            <th scope="col">Event</th>
                                            <th scope="col">Type</th>
                                            <th scope="col">House</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Win/Loss Amount</th>
                                            <th scope="col">WagerID</th>
                                            <th scope="col"></th>
                                        </tr>}
                                    </thead>
                                    <tbody>
                                        {this.tableBody()}
                                    </tbody>
                                </table>

                                <CustomPagination
                                    className="pagination pull-right"
                                    currentPage={currentPage - 1}
                                    totalPages={totalPages}
                                    showPages={7}
                                    onChangePage={(page) => this.onPageChange(page + 1)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    bet_activities: state.bet_activities.bet_activities,
    loading: state.bet_activities.loading,
    total: state.bet_activities.total,
    currentPage: state.bet_activities.currentPage,
    filter: state.bet_activities.filter,
    sports: state.bet_activities.sports,
})

export default connect(mapStateToProps, bet_activities.actions)(BetActivities)