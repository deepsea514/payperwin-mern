import React from "react";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import dateformat from "dateformat";
import * as cashback from "../redux/reducers";
import { getLossHistory } from "../redux/services";

class CashbackDetail extends React.Component {
    constructor(props) {
        super(props);
        const { match: { params: { user, year, month } } } = props;
        this.state = {
            user_id: user,
            year,
            month,
            loading: false,
            history: [],
            user: null,
        }
    }

    componentDidMount() {
        const { user_id, year, month } = this.state;
        this.setState({ loading: true });
        getLossHistory(user_id, year, month)
            .then(({ data }) => {
                const { history, user } = data;
                this.setState({ history, user, loading: false })
            })
            .catch(() => {
                this.setState({ loading: false });
            });
    }

    getDate = (date) => {
        return dateformat(new Date(date), "mediumDate");
    }

    tableBody = () => {
        const { history, loading } = this.state;

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
        if (history.length == 0) {
            return (
                <tr>
                    <td colSpan="11" align="center">
                        <h3>No Data</h3>
                    </td>
                </tr>
            );
        }

        return history.map((betlog, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{dateformat(new Date(betlog.createdAt), "mediumDate")}</td>
                <td>${betlog.WagerInfo.ToRisk}</td>
            </tr>
        ));
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-11 order-xxl-12 text-center">
                    <div className="card card-custom gutter-b text-left">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">HIGH STAKER Loss History</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">Lost Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.tableBody()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card-footer">
                            <Link to="/" className="btn btn-secondary">Cancel</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps, cashback)(CashbackDetail)