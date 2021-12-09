import React from "react"
import * as faq from "../redux/reducers";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import CustomPagination from "../../../components/CustomPagination.jsx";
import { Link } from "react-router-dom";
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import SubjectModal from "../components/SubjectModal";
import { addFAQSubject, deleteFAQSubject } from "../redux/services";

class FAQ extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            resMessage: '',
            modalvariant: "success",
            deleteId: null,
            perPage: 25,
            addSubject: false,
        };
    }

    componentDidMount() {
        const { getFAQSubjects } = this.props;
        getFAQSubjects();
    }

    tableBody = () => {
        const { faq_subjects, loading } = this.props;

        if (loading) {
            return (
                <tr>
                    <td colSpan="9" align="center">
                        <Preloader use={ThreeDots}
                            size={100}
                            strokeWidth={10}
                            strokeColor="#F0AD4E"
                            duration={800} />
                    </td>
                </tr>
            );
        }
        if (faq_subjects.length == 0) {
            return (
                <tr>
                    <td colSpan="9" align="center">
                        <h3>No FAQ Subjects</h3>
                    </td>
                </tr>
            );
        }

        return faq_subjects.map((faq_subject, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{faq_subject.title}</td>
                    <td>{faq_subject.items.length}</td>
                    <td>
                        <Dropdown>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                Actions
                            </Dropdown.Toggle>

                            <Dropdown.Menu popperConfig={{ strategy: "fixed" }}>
                                <Dropdown.Item as={Link} to={`/${faq_subject._id}/items`}><i className="far fa-eye"></i>&nbsp; Detail</Dropdown.Item>
                                <Dropdown.Item onClick={() => this.setState({ deleteId: faq_subject._id })}><i className="fas fa-trash"></i>&nbsp; Delete Subject</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </td>
                </tr>
            )
        })
    }

    addSubjectAction = (value, formik) => {
        const { getFAQSubjects } = this.props;
        addFAQSubject(value)
            .then(({ data }) => {
                const { success, error } = data;
                if (success) {
                    this.setState({ modal: true, addSubject: null, resMessage: "Subject added!", modalvariant: "success" });
                    getFAQSubjects();
                } else {
                    this.setState({ modal: true, addSubject: null, resMessage: error, modalvariant: "danger" });
                }
            })
            .catch(() => {
                this.setState({ modal: true, addSubject: null, resMessage: "Can't add subject!", modalvariant: "danger" });
            });
    }

    deleteSubject = () => {
        const { getFAQSubjects } = this.props;
        const { deleteId } = this.state;
        deleteFAQSubject(deleteId)
            .then(({ data }) => {
                const { success, error } = data;
                if (success) {
                    this.setState({ modal: true, deleteId: null, resMessage: "Subject deleted!", modalvariant: "success" });
                    getFAQSubjects();
                } else {
                    this.setState({ modal: true, deleteId: null, resMessage: error, modalvariant: "danger" });
                }
            })
            .catch(() => {
                this.setState({ modal: true, deleteId: null, resMessage: "Can't delete subject!", modalvariant: "danger" });
            });
    }

    render() {
        const { perPage, addSubject, modal, resMessage, modalvariant, deleteId } = this.state;
        const { total, currentPage } = this.props;
        let totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;

        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">FAQ Subjects</h3>
                            </div>
                            <div className="card-toolbar">
                                <Button variant="success" onClick={() => this.setState({ addSubject: true })}>
                                    Add Subject
                                </Button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Title</th>
                                            <th scope="col"># of Items</th>
                                            <th scope="col">Detail</th>
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

                {addSubject && <SubjectModal
                    onHide={() => this.setState({ addSubject: false })}
                    show={addSubject}
                    onSubmit={this.addSubjectAction}
                />}

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
                        <Modal.Title>Do you want to delete this subject?</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ deleteId: null })}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.deleteSubject}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    faq_subjects: state.faq.faq_subjects,
    loading: state.faq.loading,
    total: state.faq.total,
    currentPage: state.faq.currentPage,
})

export default connect(mapStateToProps, faq.actions)(FAQ)