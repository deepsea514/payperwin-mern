import React from "react"
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import * as credits from "../redux/reducers";
import CustomPagination from "../../../components/CustomPagination.jsx";
import CreditModal from "../components/CreditModal";
import { Button, Modal, DropdownButton, Dropdown } from 'react-bootstrap';
import { setCredit } from "../redux/services";
import { Link } from 'react-router-dom';

class Credits extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 25,
            addModal: false,
            modal: false,
            resMessage: '',
            modalvariant: '',
            adjustId: null,
            initialValues: null,
        }
    }

    componentDidMount() {
        const { getCreditsAction } = this.props;
        getCreditsAction();
    }

    tableBody = () => {
        const { credits, loading } = this.props;

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
        if (credits.length == 0) {
            return (
                <tr>
                    <td colSpan="11" align="center">
                        <h3>No Credits</h3>
                    </td>
                </tr>
            );
        }

        return credits.map((user, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{user.email}</td>
                <td>${Number(user.balance).toFixed(2)}</td>
                <td>${Number(user.inplay).toFixed(2)}</td>
                <td>${user.creditUsed} / ${user.credit}</td>
                <td>
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            Actions
                        </Dropdown.Toggle>

                        <Dropdown.Menu popperConfig={{ strategy: "fixed" }}>
                            <Dropdown.Item onClick={() => this.setAdjustId(user)}><i className="fas fa-edit"></i>&nbsp; Adjust Credit</Dropdown.Item>
                            <Dropdown.Item as={Link} to={`/${user._id}/detail`}><i className="fas fa-eye"></i>&nbsp; Detail</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </td>
            </tr>
        ));
    }

    setAdjustId = (user) => {
        this.setState({
            adjustId: user._id,
            initialValues: {
                user: { value: user._id, label: `${user.email} (${user.firstname} ${user.lastname})` },
                type: '',
                amount: 0
            }
        })
    }

    onPageChange = (page) => {
        const { getCreditsAction } = this.props;
        getCreditsAction(page);
    }

    setCredit = (values, formik) => {
        const { getCreditsAction } = this.props;
        const data = {
            ...values,
            user: values.user.value,
        };
        setCredit(data)
            .then(({ data }) => {
                formik.setSubmitting(false);
                if (data.success) {
                    this.setState({ modal: true, addModal: false, adjustId: null, resMessage: "Successfully added!", modalvariant: "success" });
                    getCreditsAction();
                } else {
                    this.setState({ modal: true, addModal: false, adjustId: null, resMessage: data.message, modalvariant: "danger" });
                }
            })
            .catch(() => {
                formik.setSubmitting(false);
                this.setState({ modal: true, addModal: false, resMessage: "Addition Failed!", modalvariant: "danger" });
            })
    }

    render() {
        const { perPage, addModal, modal, resMessage, modalvariant, adjustId, initialValues } = this.state;
        const { total, currentPage } = this.props;
        const totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;

        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Line of Credits</h3>
                            </div>
                            <div className="card-toolbar">
                                <Button className="btn btn-success font-weight-bolder font-size-sm" onClick={() => this.setState({ addModal: true })}>
                                    <i className="fas fa-users"></i>&nbsp; Add Credit
                                </Button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Customer</th>
                                            <th scope="col">Balance</th>
                                            <th scope="col">In Play</th>
                                            <th scope="col">Credit Used</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.tableBody()}
                                    </tbody>
                                </table>
                            </div>
                            <CustomPagination
                                className="pagination"
                                currentPage={currentPage - 1}
                                totalPages={totalPages}
                                showPages={7}
                                onChangePage={(page) => this.onPageChange(page + 1)}
                            />
                        </div>
                    </div>
                    <CreditModal
                        show={addModal}
                        onHide={() => this.setState({ addModal: false })}
                        title="Add Credit"
                        onSubmit={this.setCredit}
                    />

                    {adjustId && <CreditModal
                        show={adjustId != null}
                        onHide={() => this.setState({ adjustId: null })}
                        title="Adjust Credit"
                        edit
                        initialValues={initialValues}
                        onSubmit={this.setCredit}
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
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    credits: state.credits.credits,
    loading: state.credits.loading,
    total: state.credits.total,
    currentPage: state.credits.currentPage,
})

export default connect(mapStateToProps, credits.actions)(Credits)