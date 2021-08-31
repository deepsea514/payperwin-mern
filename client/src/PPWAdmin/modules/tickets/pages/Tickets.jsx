import React, { Component } from 'react';
import CustomPagination from "../../../components/CustomPagination.jsx";
import * as tickets from "../redux/reducers";
import dateformat from "dateformat";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { RadioGroup, Radio, FormControlLabel } from '@material-ui/core';

class Tickets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 25,
        }
    }

    componentDidMount() {
        const { getTickets } = this.props;
        getTickets();
    }

    onPageChange = (page) => {
        const { getTickets, currentPage } = this.props;
        if (page != currentPage)
            getTickets(status, page);
    }

    handleStatusChange = async (evt) => {
        const { getTickets } = this.props;
        getTickets(evt.target.value);
    }

    getDateFormat = (date) => {
        if (!date) return '';
        return dateformat(new Date(date), "yyyy-mm-dd HH:MM");
    }

    tableBody = () => {
        const { tickets, loading, history } = this.props;

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
        if (tickets.length == 0) {
            return (
                <tr>
                    <td colSpan="12" align="center">
                        <h3>No Support Tickets</h3>
                    </td>
                </tr>
            );
        }

        return tickets.map((ticket, index) => (
            <tr key={index} className="text-hover-primary" style={{ cursor: 'pointer' }} onClick={() => { history.push(`/${ticket._id}/detail`) }}>
                <td>{index + 1}</td>
                <td>{ticket.email}</td>
                <td>{ticket.subject}</td>
                <td>{ticket.department}</td>
                <td>{this.getDateFormat(ticket.createdAt)}</td>
                <td>{this.getDateFormat(ticket.repliedAt)}</td>
            </tr>
        ));
    }

    render() {
        const { perPage } = this.state;
        const { total, currentPage, status } = this.props;
        const totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;

        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Support tickets</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <RadioGroup
                                value={status}
                                onChange={this.handleStatusChange}
                                row
                            >
                                <FormControlLabel
                                    value="new"
                                    control={<Radio color="primary" />}
                                    label="New"
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    value="replied"
                                    control={<Radio color="primary" />}
                                    label="Replied"
                                    labelPlacement="end"
                                />
                                <FormControlLabel
                                    value="all"
                                    control={<Radio color="primary" />}
                                    label="All"
                                    labelPlacement="end"
                                />
                            </RadioGroup>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">From email</th>
                                            <th scope="col">Subject</th>
                                            <th scope="col">Department</th>
                                            <th scope="col">Submitted At</th>
                                            <th scope="col">Replied At</th>
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
        )
    }
}

const mapStateToProps = (state) => ({
    tickets: state.tickets.tickets,
    loading: state.tickets.loading,
    total: state.tickets.total,
    currentPage: state.tickets.currentPage,
    status: state.tickets.status,
})

export default connect(mapStateToProps, tickets.actions)(Tickets)