import React from "react"
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import CustomPagination from "../../../components/CustomPagination.jsx";
import { Link } from "react-router-dom";
import * as messages from "../redux/reducers";

class MessageCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 25,
        }
    }

    componentDidMount() {

    }

    tableBody = () => {
        const { message_drafts, loading } = this.props;

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
        if (message_drafts.length == 0) {
            return (
                <tr>
                    <td colSpan="11" align="center">
                        <h3>No Drafts</h3>
                    </td>
                </tr>
            );
        }
    }

    onPageChange = (page) => {

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
                                <h3 className="card-label">Message Drafts</h3>
                            </div>
                            <div className="card-toolbar">
                                <Link to="/create" className="btn btn-success font-weight-bolder font-size-sm">
                                    <i className="fas fa-envelope"></i>&nbsp; Create a New Message
                                </Link>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Title</th>
                                            <th scope="col">Created At</th>
                                            <th scope="col"></th>
                                        </tr>
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
    message_drafts: state.messages.message_drafts,
    loading: state.messages.loading,
    total: state.messages.total,
    currentPage: state.messages.currentPage,
})


export default connect(mapStateToProps, messages.actions)(MessageCenter)