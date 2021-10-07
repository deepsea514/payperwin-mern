import React, { createRef } from "react";
import { Dropdown, DropdownButton, Modal, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import * as bet_activities from "../redux/reducers";
import * as autobet from "../../autobet/redux/reducers";
import dateformat from "dateformat";
import { getSports, getWagerActivityAsCSV, deleteBet, settleBet, matchBet } from "../redux/services";
import CustomPagination from "../../../components/CustomPagination.jsx";
import { CSVLink } from 'react-csv';
import CustomDatePicker from "../../../../components/customDatePicker";
import numberFormat from "../../../../helpers/numberFormat";
import SettleBetModal from "../components/SettleBetModal";
import ManualMatchBetModal from "../components/ManualMatchBetModal";

class BetActivities extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 25,
            wagerActivityDownloadData: [],
            deleteId: null,
            settleId: null,
            matchId: null,
            modal: false,
            resMessage: "",
            modalvariant: "success",
        }
        this.csvRef = createRef();
    }

    componentDidMount() {
        const { getBetActivities, getSportsSuccess, getAutoBetsAction } = this.props;
        getAutoBetsAction();
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
        const { bet_activities, loading, filter, autobets } = this.props;

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

        return bet_activities.map((bet, index) => {
            let isAutobet = false;
            if (autobets && autobets.find(autobet => autobet.userId && bet.userId ? autobet.userId._id == bet.userId._id : false)) isAutobet = true;
            return <tr key={index} className={isAutobet ? 'bg-light-primary' : ''}>
                <td scope="col">{index + 1}</td>
                <td scope="col">{this.getBetHouse(bet.sportsbook)}</td>
                <td scope="col">{this.getDateFormat(bet.createdAt)}</td>
                <td scope="col">${numberFormat(bet.bet.toFixed(2))} {bet.userId ? bet.userId.currency : null} (${numberFormat(bet.toWin.toFixed(2))})</td>
                <td scope="col">{bet.pickName} @ {Number(bet.pickOdds) > 0 ? '+' + bet.pickOdds : bet.pickOdds}</td>
                <td scope="col">{bet.userId ? bet.userId.email : null}</td>
                <td scope="col">{bet.origin == 'other' ? 'Other' : bet.lineQuery.sportName}</td>
                <td scope="col">{bet.origin == 'other' ? bet.lineQuery.eventName : `${bet.teamA.name} vs ${bet.teamB.name}`}</td>
                <td scope="col">{dateformat(bet.matchStartDate)}</td>
                <td scope="col">{this.getBetDogFav(bet, index)}</td>
                <td scope="col">{this.getBetStatus(bet.status)}</td>
                <td scope="col">{this.getBetMatch(bet.status)}</td>
                <td scope="col">{this.getWinLoss(bet)}</td>
                <td scope="col">{bet.transactionID}</td>
                <td scope="col">
                    <DropdownButton title="Actions">
                        <Dropdown.Item as={Link} to={`/${bet._id}/detail`}>
                            <i className="far fa-eye"></i>&nbsp; Detail
                        </Dropdown.Item>
                        {['Pending', 'Partial Match', 'Matched', null].includes(bet.status) &&
                            <>
                                <Dropdown.Item onClick={() => this.setState({ deleteId: bet._id })}>
                                    <i className="fas fa-trash"></i>&nbsp; Delete
                                </Dropdown.Item>
                                {filter.house != 'sportsbook' && <Dropdown.Item onClick={() => this.setState({ settleId: bet._id })}>
                                    <i className="fas fa-check"></i>&nbsp; Settle
                                </Dropdown.Item>}
                            </>
                        }
                        {['Pending', 'Partial Match'].includes(bet.status) &&
                            <Dropdown.Item onClick={() => this.setState({ matchId: bet._id })}>
                                <i className="fas fa-link"></i>&nbsp; Manual Match
                            </Dropdown.Item>
                        }
                    </DropdownButton>
                </td>
            </tr>
        });
    }

    deleteBet = () => {
        const { deleteId } = this.state;
        const { getBetActivities } = this.props;
        deleteBet(deleteId)
            .then(() => {
                this.setState({ modal: true, deleteId: null, resMessage: "Successfully deleted!", modalvariant: "success" });
                getBetActivities();
            })
            .catch(() => {
                this.setState({ modal: true, deleteId: null, resMessage: "Deletion Failed!", modalvariant: "danger" });
            })
    }

    onSettleBet = (values, formik) => {
        const { settleId } = this.state;
        const { getBetActivities } = this.props;
        settleBet(settleId, values)
            .then(() => {
                formik.setSubmitting(false);
                this.setState({ modal: true, settleId: null, resMessage: "Successfully Settled!", modalvariant: "success" });

                getBetActivities();
            })
            .catch(() => {
                formik.setSubmitting(false);
                this.setState({ modal: true, settleId: null, resMessage: "Settle Failed!", modalvariant: "danger" });
            })
    }

    onMatchBet = (values, formik) => {
        const { matchId } = this.state;
        const { getBetActivities } = this.props;
        matchBet(matchId, { user: values.user.value, amount: values.amount })
            .then(({ data }) => {
                if (data.success) {
                    formik.setSubmitting(false);
                    this.setState({ modal: true, matchId: null, resMessage: "Successfully Matched!", modalvariant: "success" });
                    getBetActivities();
                } else {
                    formik.setSubmitting(false);
                    this.setState({ modal: true, matchId: null, resMessage: data.error, modalvariant: "danger" });
                }
            })
            .catch(() => {
                formik.setSubmitting(false);
                this.setState({ modal: true, matchId: null, resMessage: "Match Failed!", modalvariant: "danger" });
            })
    }

    getBetDogFav = (bet) => {
        const { teamA, teamB, pick, pickName, lineQuery } = bet;
        if (!teamA) return;
        const oddsA = Number(teamA.odds);
        const oddsB = Number(teamB.odds);

        if (['spread', 'alternative_spread'].includes(lineQuery.type)) {
            let spreads = pickName.split(' ');
            spreads = Number(spreads[spreads.length - 1]);
            if (spreads < 0) {
                return <span className="label label-lg label-outline-success label-inline font-weight-lighter mr-2">Favorite</span>
            }
        } else {
            if (oddsA == oddsB) {
                if (pick == 'away') {
                    return <span className="label label-lg label-outline-success label-inline font-weight-lighter mr-2">Favorite</span>
                }
            } else {
                if ((oddsA < oddsB) && pick == 'home' || (oddsA > oddsB) && pick == 'away') {
                    return <span className="label label-lg label-outline-success label-inline font-weight-lighter mr-2">Favorite</span>
                }
            }
        }
        return <span className="label label-lg label-outline-warning label-inline font-weight-lighter mr-2">Underdog</span>
    }

    getBetStatus = (status) => {
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
                return <span className="label label-lg label-success label-inline font-weight-lighter mr-2">Win</span>
            case "Draw":
                return <span className="label label-lg label-warning label-inline font-weight-lighter mr-2">Draw</span>
            case "Accepted":
                return <span className="label label-lg label-light-success label-inline font-weight-lighter mr-2">Accepted</span>
            case "Partial Accepted":
                return <span className="label label-lg label-light-warning label-inline font-weight-lighter mr-2">Partial Accepted</span>
        }
    }

    getBetMatch = (status) => {
        switch (status) {
            case "Cancelled":
            case "Settled - Lose":
            case "Settled - Win":
            case "Draw":
                return <span className="label label-lg label-success label-inline font-weight-lighter mr-2">Settled</span>
            case "Pending":
            case "Partial Match":
            case "Matched":
            case "Accepted":
            case "Partial Accepted":
            default:
                return <span className="label label-lg label-info label-inline font-weight-lighter mr-2">Open</span>
        }
    }

    getWinLoss = (bet) => {
        switch (bet.status) {
            case "Settled - Lose":
                return `- $${bet.bet.toFixed(2)} CAD`;
            case "Settled - Win":
                return `+ $${(bet.payableToWin).toFixed(2)} CAD`
            case "Pending":
            case "Partial Match":
            case "Matched":
            case "Cancelled":
            default:
                return "$0 CAD";
        }
    }

    getBetHouse = (sportsbook) => {
        if(sportsbook) {
            return <span className="label label-lg label-light-danger label-inline font-weight-lighter mr-2">SB</span>
        }
        return <span className="label label-lg label-light-success label-inline font-weight-lighter mr-2">P2P</span>
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
        const { perPage, wagerActivityDownloadData, deleteId, modal, resMessage, modalvariant, settleId, matchId } = this.state;
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
                                        <option value="">All</option>
                                        <option value="p2p">P2P Bets</option>
                                        <option value="sportsbook">SB Bets</option>
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
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Type</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">Wager</th>
                                            <th scope="col">Pick</th>
                                            <th scope="col">User</th>
                                            <th scope="col">Sport</th>
                                            <th scope="col">Event</th>
                                            <th scope="col">Start Date</th>
                                            <th scope="col">Dog/Fav</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Match</th>
                                            <th scope="col">Win/Loss Amount</th>
                                            <th scope="col">TransactionID</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.tableBody()}
                                    </tbody>
                                </table>
                            </div>
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
                <Modal show={deleteId != null} onHide={() => this.setState({ deleteId: null })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Do you want to delete this log?</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ deleteId: null })}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.deleteBet}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={modal} onHide={() => this.setState({ modal: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>{resMessage}</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant={modalvariant} onClick={() => this.setState({ modal: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {settleId && <SettleBetModal
                    show={settleId != null}
                    onHide={() => this.setState({ settleId: null })}
                    onSubmit={this.onSettleBet}
                />}

                {matchId && <ManualMatchBetModal
                    show={matchId != null}
                    onHide={() => this.setState({ matchId: null })}
                    onSubmit={this.onMatchBet}
                />}
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
    autobets: state.autobets.autobets,
})

export default connect(mapStateToProps, { ...bet_activities.actions, ...autobet.actions })(BetActivities)