import React from "react"
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import * as team from "../redux/reducers";
import _env from '../../../../env.json';
import { deleteMember } from "../redux/services";
const appUrl = _env.appUrl;

class TeamMembers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            deleteId: null,
            modal: false,
            modalvariant: '',
            resMessage: ''
        }
    }

    componentDidMount() {
        const { getMembersAction } = this.props;
        getMembersAction();
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

        return members.map((member, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td><img src={appUrl + member.photo} style={{ width: '100px', height: 'auto' }} /></td>
                <td>{member.name}</td>
                <td>{member.position}</td>
                <td>{member.priority}</td>
                <td>
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            Actions
                        </Dropdown.Toggle>

                        <Dropdown.Menu popperConfig={{ strategy: "fixed" }}>
                            <Dropdown.Item as={Link} to={`/edit/${member._id}`}><i className="fas fa-edit"></i>&nbsp; Edit</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.setState({ deleteId: member._id })}><i className="fas fa-trash"></i>&nbsp; Delete</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </td>
            </tr>
        ));
    }

    deleteMember = () => {
        const { deleteId } = this.state;
        const { getMembersAction } = this.props;
        deleteMember(deleteId)
            .then(() => {
                this.setState({ modal: true, deleteId: null, resMessage: "Successfully deleted!", modalvariant: "success" });
                getMembersAction();
            })
            .catch(() => {
                this.setState({ modal: true, deleteId: null, resMessage: "Deletion Failed!", modalvariant: "danger" });
            })
    }

    render() {
        const { deleteId, modal, modalvariant, resMessage } = this.state;

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
                                            <th scope="col">Photo</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Position</th>
                                            <th scope="col">Priority</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.tableBody()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
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

                        <Modal show={deleteId != null} onHide={() => this.setState({ deleteId: null })}>
                            <Modal.Header closeButton>
                                <Modal.Title>Do you want to delete this Article?</Modal.Title>
                            </Modal.Header>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => this.setState({ deleteId: null })}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={this.deleteMember}>
                                    Confirm
                                </Button>
                            </Modal.Footer>
                        </Modal>
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