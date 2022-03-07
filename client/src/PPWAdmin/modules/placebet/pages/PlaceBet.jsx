import React from "react"
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import * as placebets from "../redux/reducers";
import dateformat from "dateformat";
import numberFormat from "../../../../helpers/numberFormat";
import "react-datepicker/dist/react-datepicker.css";
import CustomPagination from "../../../components/CustomPagination.jsx";
import PlaceBetModal from "../components/PlaceBetModal";
import { createPlaceBet, deletePlaceBet, updatePlaceBet } from "../redux/services";
import * as Yup from "yup";
import { Formik } from "formik";
import config from "../../../../../../config.json";
const PlaceBetStatus = config.PlaceBetStatus;

class PlaceBet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 25,
            addModal: false,
            modal: false,
            resMessage: "",
            modalvariant: "success",
            deleteId: null,
            editId: null,
            initialValues: null,
            statusSchema: Yup.object().shape({
                status: Yup.string()
                    .required("Status field is required"),
            }),
        }
    }

    componentDidMount() {
        const { getPlaceBetsAction } = this.props;
        getPlaceBetsAction();
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

    getBetMatch = (bet) => {
        switch (bet.status) {
            case "Cancelled":
            case "Settled - Lose":
            case "Settled - Win":
            case "Draw":
                return <span className="label label-lg label-success label-inline font-weight-lighter mr-2">Settled ({bet.homeScore} : {bet.awayScore})</span>
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
        if (sportsbook) {
            return <span className="label label-lg label-light-danger label-inline font-weight-lighter mr-2">SB</span>
        }
        return <span className="label label-lg label-light-success label-inline font-weight-lighter mr-2">P2P</span>
    }

    getDateFormat = (date) => {
        return dateformat(new Date(date), "yyyy-mm-dd HH:MM");
    }

    getPickName = (formValues) => {
        let { teamA, teamB, points, betType, pick, peorid } = formValues;
        let pickName = '';
        betType = betType.value.toLowerCase();
        switch (peorid) {
            case 'first_half':
                pickName += '1st Half: ';
                break;
            case 'second_half':
                pickName += '2nd Half: ';
                break;
            case 'first_quarter':
                pickName += '1st Quarter: ';
                break;
            case 'second_quarter':
                pickName += '2nd Quarter: ';
                break;
            case 'third_quarter':
                pickName += '3rd Quarter: ';
                break;
            case 'forth_quarter':
                pickName += '4th Quarter: ';
                break;
            case 'fifth_innings':
                pickName += '5th Innings: ';
                break;
            default:
                pickName += 'Pick: ';
                break;
        }

        switch (betType) {
            case 'total':
                if (pick == 'home') {
                    pickName += `Over ${points}`;
                } else {
                    pickName += `Under ${points}`;
                }
                break;
            case 'spread':
                if (pick == 'home') {
                    pickName += `${teamA} ${points > 0 ? '+' : ''}${points}`;
                } else {
                    pickName += `${teamB} ${-1 * points > 0 ? '+' : ''}${-1 * points}`;
                }
                break;
            case 'moneyline':
                if (pick == 'home') {
                    pickName += teamA;
                }
                else if (pick == 'away') {
                    pickName += teamB;
                }
                break;
        }
        return pickName;
    }

    tableBody = () => {
        const { placebets, loading } = this.props;

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
        if (placebets.length == 0) {
            return (
                <tr>
                    <td colSpan="12" align="center">
                        <h3>No Bet Place by Admin</h3>
                    </td>
                </tr>
            );
        }

        return placebets.map((bet, index) => {
            let isAutobet = false;
            return <tr key={index} className={isAutobet ? 'bg-light-primary' : ''}>
                <td scope="col">{index + 1}</td>
                <td scope="col">{this.getBetHouse(bet.sportsbook)}</td>
                <td scope="col">{this.getDateFormat(bet.createdAt)}</td>
                <td scope="col">${numberFormat(bet.bet.toFixed(2))} {bet.userId ? bet.userId.currency : null} (${numberFormat(bet.toWin.toFixed(2))})</td>
                <td scope="col">{bet.pickName} @ {Number(bet.pickOdds) > 0 ? '+' + bet.pickOdds : bet.pickOdds}</td>
                <td scope="col">{bet.userId ? bet.userId.email : null}</td>
                <td scope="col">{bet.origin == 'custom' ? bet.lineQuery.eventName : `${bet.teamA.name} vs ${bet.teamB.name}`}</td>
                <td scope="col">{dateformat(bet.matchStartDate)}</td>
            </tr>
        });
    }

    getStatus = (status) => {
        if (status === PlaceBetStatus.active)
            return <span className="label label-lg label-success label-inline font-weight-lighter mr-2">{status}</span>
        return <span className="label label-lg label-danger label-inline font-weight-lighter mr-2">{status}</span>
    }

    getRollOver = (rollOver) => {
        if (rollOver)
            return <span className="label label-lg label-outline-success label-inline font-weight-lighter mr-2">Yes</span>
        return <span className="label label-lg label-outline-danger label-inline font-weight-lighter mr-2">No</span>
    }

    onPageChange = (page) => {
        const { getPlaceBetsAction, currentPage } = this.props;
        if (page != currentPage)
            getPlaceBetsAction(page);
    }

    addPlaceBetUser = (values, formik) => {
        const { getPlaceBetsAction } = this.props;

        let pick = values.pick;

        const placebet = {
            user: {
                _id: values.user.value,
                balance: 3000,
            },
            userId: values.user.value,
            autoBetUser: values.autoBetUser.value,
            autoBetUserId: values.autoBetUser.autoBetUserId._id,
            name: `${values.teamA} - ${values.teamB} `,
            type: values.betType.value,
            subtype: null,
            league: 'ITF W15 Antalya',
            teamBOdds: values.teamBOdds,
            teamAOdds: values.teamAOdds,
            odds: { home: values.teamAOdds, away: values.teamBOdds },
            pick: pick,
            stake: values.wager,
            win: values.toWin,
            home: values.teamA,
            away: values.teamB,
            teamA: values.teamA,
            teamB: values.teamB,
            sportName: values.sports.value,
            lineId: '0',
            lineQuery: {
                sportName: values.sports.value,
                leagueId: '0',
                eventId: '0',
                lineId: '0',
                type: values.betType.value,
                subtype: values.peorid || null,
                index: null,
                points: values.points || null,
            },

            pickName: this.getPickName(values),
            index: null,
            origin: 'admin',
            sportsbook: false,
            startDate: values.registrationDate
        };

        formik.setSubmitting(false);

        createPlaceBet(placebet)
            .then(({ data }) => {
                formik.setSubmitting(false);
                if (data.errors.length === 0) {
                    this.setState({ modal: true, addModal: false, resMessage: "Bet Successfully added!", modalvariant: "success" });
                    getPlaceBetsAction();
                } else {
                    this.setState({ modal: true, addModal: false, resMessage: data.message, modalvariant: "danger" });
                }
            })
            .catch(() => {
                formik.setSubmitting(false);
                this.setState({ modal: true, addModal: false, resMessage: "Bet Addition Failed!", modalvariant: "danger" });
            })
    }

    render() {
        const { perPage, addModal, modal, resMessage, modalvariant, editId: editId,
            initialValues, deleteId } = this.state;
        const { total, currentPage } = this.props;
        const totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;

        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Place Bets for User</h3>
                            </div>
                            <div className="card-toolbar">
                                <Button className="btn btn-success font-weight-bolder font-size-sm" onClick={() => this.setState({ addModal: true })}>
                                    <i className="fas fa-users"></i>&nbsp; Add a Bet
                                </Button>
                            </div>
                        </div>
                        <div className="card-body">
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
                                            <th scope="col">Event</th>
                                            <th scope="col">Start Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.tableBody()}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
                <PlaceBetModal
                    show={addModal}
                    onHide={() => this.setState({ addModal: false })}
                    title="Add a Bet"
                    onSubmit={this.addPlaceBetUser}
                />

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

                {editId && <PlaceBetModal
                    show={editId != null}
                    onHide={() => this.setState({ editId: null })}
                    title="Edit AutoBet User"
                    edit={true}
                    initialValues={initialValues}
                    onSubmit={this.editAutoBetUser}
                />}

                <Modal show={deleteId != null} onHide={() => this.setState({ deleteId: null })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Do you want to delete this log?</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ deleteId: null })}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.deleteAutoBet}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    placebets: state.placebets.placebets,
    loading: state.placebets.loading,
    total: state.placebets.total,
    currentPage: state.placebets.currentPage,
})

export default connect(mapStateToProps, placebets.actions)(PlaceBet)