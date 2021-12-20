import React from "react"
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import * as mismatch_scores from "../redux/reducers";
import dateformat from "dateformat";
import "react-datepicker/dist/react-datepicker.css";
import CustomPagination from "../../../components/CustomPagination.jsx";

class MismatchScores extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 25,
        }
    }

    componentDidMount() {
        const { getMismatchScoresAction } = this.props;
        getMismatchScoresAction();
    }

    getDateFormat = (date) => {
        return dateformat(new Date(date), "yyyy-mm-dd HH:MM");
    }

    tableBody = () => {
        const { mismatch_scores, loading } = this.props;

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
        if (mismatch_scores.length == 0) {
            return (
                <tr>
                    <td colSpan="11" align="center">
                        <h3>No Result</h3>
                    </td>
                </tr>
            );
        }

        return mismatch_scores.map((bet, index) => {
            if (bet.isParlay) {
                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{this.getDateFormat(bet.updatedAt)}</td>
                        <td>
                            <ul>
                                {bet.parlayQuery.map((query, index) => {
                                    return (
                                        <li key={index}>
                                            {index + 1}: {query.teamA.name} VS {query.teamB.name}
                                        </li>
                                    )
                                })}
                            </ul>
                        </td>
                        <td>
                            <ul>
                                {bet.parlayQuery.map((query, index) => {
                                    return (
                                        <li key={index}>
                                            {index + 1}: {query.homeScore}-{query.awayScore}
                                        </li>
                                    )
                                })}
                            </ul>
                        </td>
                        <td>
                            <ul>
                                {bet.scoreMismatch.map((query, index) => {
                                    return (
                                        <li key={index}>
                                            {index + 1}: {query.homeScore}-{query.awayScore}
                                        </li>
                                    )
                                })}
                            </ul>
                        </td>
                        <td>{bet.userId.email}</td>
                        <td></td>
                    </tr>
                );
            }
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{this.getDateFormat(bet.updatedAt)}</td>
                    <td>{bet.teamA.name} VS {bet.teamB.name}</td>
                    <td>{bet.homeScore}-{bet.awayScore}</td>
                    <td>{bet.scoreMismatch.homeScore} VS {bet.scoreMismatch.awayScore}</td>
                    <td>{bet.userId.email}</td>
                    <td></td>
                </tr>
            )
        });
    }

    onPageChange = (page) => {
        const { getMismatchScoresAction } = this.props;
        getMismatchScoresAction(page);
    }

    render() {
        const { perPage } = this.state;
        const { total, currentPage } = this.props;
        const totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;

        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Mismatch Scores</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">Game</th>
                                            <th scope="col">Original Results</th>
                                            <th scope="col">Post Results</th>
                                            <th scope="col">Customer</th>
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
            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    mismatch_scores: state.mismatch_scores.mismatch_scores,
    loading: state.mismatch_scores.loading,
    total: state.mismatch_scores.total,
    currentPage: state.mismatch_scores.currentPage,
    filter: state.mismatch_scores.filter,
})

export default connect(mapStateToProps, mismatch_scores.actions)(MismatchScores)