import React from "react"
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import CustomPagination from "../../../components/CustomPagination.jsx";
import { Link } from "react-router-dom";
import * as messages from "../redux/reducers";
import dateformat from "dateformat";
import { deleteMessageDraft } from "../redux/services.js";

class MessageCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 25,
            deleteId: null,
            modal: false,
            resMessage: '',
            modalvariant: '',
        }
    }

    componentDidMount() {
        const { getMessagesAction } = this.props;
        getMessagesAction();
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

        return message_drafts.map((message, index) => (
            <tr key={index}>
                <th scope="col">{index + 1}</th>
                <th scope="col">{message.title}</th>
                <th scope="col">{message.type}</th>
                <th scope="col">{dateformat(new Date(message.createdAt), "yyyy-mm-dd HH:MM")}</th>
                <th scope="col">
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            Actions
                        </Dropdown.Toggle>

                        <Dropdown.Menu popperConfig={{ strategy: "fixed" }}>
                            <Dropdown.Item as={Link} to={`/edit/${message._id}`}><i className="fas fa-edit"></i>&nbsp; Edit</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.setState({ deleteId: message._id })}><i className="fas fa-trash"></i>&nbsp; Delete Draft</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </th>
            </tr>
        ))
    }

    onPageChange = (page) => {
        const { getMessagesAction } = this.props;
        getMessagesAction(page);
    }

    deleteMessageDraft = () => {
        const { deleteId } = this.state;
        const { getMessagesAction } = this.props;
        deleteMessageDraft(deleteId)
            .then(() => {
                this.setState({ modal: true, deleteId: null, resMessage: "Successfully deleted!", modalvariant: "success" });
                getMessagesAction();
            })
            .catch(() => {
                this.setState({ modal: true, deleteId: null, resMessage: "Deletion Failed!", modalvariant: "danger" });
            })
    }

    render() {
        const { perPage, deleteId, modal, resMessage, modalvariant } = this.state;
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
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Title</th>
                                            <th scope="col">Type</th>
                                            <th scope="col">Created At</th>
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
                                    <Modal.Title>Do you want to delete this Draft?</Modal.Title>
                                </Modal.Header>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => this.setState({ deleteId: null })}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" onClick={this.deleteMessageDraft}>
                                        Confirm
                                    </Button>
                                </Modal.Footer>
                            </Modal>
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