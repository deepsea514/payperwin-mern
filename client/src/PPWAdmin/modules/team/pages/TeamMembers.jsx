import React from "react"
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import * as team from "../redux/reducers";

class TeamMembers extends React.Component {
    componentDidMount() {

    }

    tableBody = () => {
        const { members, loading } = this.props;

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
        if (members.length == 0) {
            return (
                <tr>
                    <td colSpan="11" align="center">
                        <h3>No Members</h3>
                    </td>
                </tr>
            );
        }

        // return wager_feeds.map((bet, index) => (
        //     return 
        // ));
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Wager Feeds</h3>
                            </div>
                            <div className="card-toolbar">
                                <Link to={"/create"} className="btn btn-success font-weight-bolder font-size-sm mr-2">
                                    Add a New Member
                                </Link>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Position</th>
                                            <th scope="col">Priority</th>
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
            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    members: state.team.members,
    loading: state.team.loading,
})

export default connect(mapStateToProps, team.actions)(TeamMembers)