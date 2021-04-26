import React, { Component } from 'react';
import CustomPagination from "../../../components/CustomPagination.jsx";
import * as kyc from "../redux/reducers";
import dateformat from "dateformat";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { IconButton } from '@material-ui/core';
import { CheckCircle, Cancel } from "@material-ui/icons";
import VerificationImageModal from "../components/VerificationImageModal";
import { acceptVerification, declineVerification, getVerificationImage } from '../redux/services.js';
import { Button, Modal } from "react-bootstrap";

class KYC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 25,
            checkVerificationId: null,
            address: {
                loading: false,
                data: null,
            },
            identification: {
                loading: false,
                data: null,
            },
            acceptID: null,
            declineID: null,
        }
    }

    componentDidMount() {
        const { getVerifications } = this.props;
        getVerifications();
    }

    onPageChange = (page) => {
        const { getVerifications, currentPage } = this.props;
        if (page != currentPage)
            getVerifications(page);
    }

    getDateFormat = (date) => {
        return dateformat(new Date(date), "yyyy-mm-dd HH:MM");
    }

    verificationDetail = (id) => {
        this.setState({
            checkVerificationId: id,
            address: {
                loading: true,
                data: null,
            },
            identification: {
                loading: true,
                data: null,
            }
        });

        getVerificationImage(id, "address")
            .then(({ data }) => {
                const { contentType, data: imageData } = data;
                const image = `data:${contentType};base64,${imageData}`;
                this.setState({
                    address: {
                        loading: false,
                        data: image,
                    }
                });
            })
            .catch(() => {
                this.setState({
                    address: {
                        loading: false,
                        data: null,
                    }
                });
            });

        getVerificationImage(id, "identification")
            .then(({ data }) => {
                const { contentType, data: imageData } = data;
                const image = `data:${contentType};base64,${imageData}`;
                this.setState({
                    identification: {
                        loading: false,
                        data: image,
                    }
                });
            })
            .catch(() => {
                this.setState({
                    identification: {
                        loading: false,
                        data: null,
                    }
                });
            });
    }

    declineVerification = () => {
        const { declineID } = this.state;
        const { getVerifications } = this.props;
        declineVerification(declineID)
            .then(() => {
                getVerifications();
            })
            .finally(() => {
                this.setState({ declineID: null });
            });
    }

    acceptVerification = () => {
        const { acceptID } = this.state;
        const { getVerifications } = this.props;
        acceptVerification(acceptID)
            .then(() => {
                getVerifications();
            }).finally(() => {
                this.setState({ acceptID: null });
            });
    }

    tableBody = () => {
        const { verifications, loading } = this.props;

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
        if (verifications.length == 0) {
            return (
                <tr>
                    <td colSpan="12" align="center">
                        <h3>No Verification Requests</h3>
                    </td>
                </tr>
            );
        }

        return verifications.map((verification, index) => (
            <tr key={index} className="text-hover-primary" style={{ cursor: 'pointer' }}>
                <td scope="col" onClick={() => this.verificationDetail(verification.user_id)}>
                    <span className="font-weight-bolder text-hover-primary mb-1 font-size-lg">{index + 1}</span>
                </td>
                <td scope="col" onClick={() => this.verificationDetail(verification.user_id)}>
                    <span className="font-weight-bolder text-hover-primary mb-1 font-size-lg">{verification.username}</span>
                </td>
                <td scope="col" onClick={() => this.verificationDetail(verification.user_id)}>
                    <span className="font-weight-bolder text-hover-primary mb-1 font-size-lg">{verification.addressStr}</span>
                </td>
                <td scope="col" onClick={() => this.verificationDetail(verification.user_id)}>
                    <span className="font-weight-bolder text-hover-primary mb-1 font-size-lg">{verification.city}</span>
                </td>
                <td scope="col" onClick={() => this.verificationDetail(verification.user_id)}>
                    <span className="font-weight-bolder text-hover-primary mb-1 font-size-lg">{verification.postalcode}</span>
                </td>
                <td scope="col" onClick={() => this.verificationDetail(verification.user_id)}>
                    <span className="font-weight-bolder text-hover-primary mb-1 font-size-lg">{verification.phone}</span>
                </td>
                <td scope="col" onClick={() => this.verificationDetail(verification.user_id)}>
                    {verification.address && <>
                        <span className="font-weight-bolder text-hover-primary mb-1 font-size-lg">{verification.address.name}</span><br />
                        <span className="text-hover-primary mb-1">Submitted At: {this.getDateFormat(verification.address.submitted_at)}</span>
                    </>}
                    <br />
                    {verification.identification && <>
                        <span className="font-weight-bolder text-hover-primary mb-1 font-size-lg">{verification.identification.name}</span><br />
                        <span className="text-hover-primary mb-1">Submitted At: {this.getDateFormat(verification.identification.submitted_at)}</span>
                    </>}
                </td>
                <td>
                    <IconButton color="primary" component="span" onClick={() => this.setState({ acceptID: verification.user_id })}>
                        <CheckCircle />
                    </IconButton>
                    <IconButton style={{ color: 'red' }} component="span" onClick={() => this.setState({ declineID: verification.user_id })}>
                        <Cancel style={{ color: 'red' }} />
                    </IconButton>
                </td>
            </tr>
        ));
    }

    render() {
        const { perPage, checkVerificationId, address, identification, acceptID, declineID } = this.state;
        const { total, currentPage } = this.props;
        const totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;

        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Know Your Customers</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">User Name</th>
                                            <th scope="col">Address</th>
                                            <th scope="col">City</th>
                                            <th scope="col">Postal Code</th>
                                            <th scope="col">Phone</th>
                                            <th scope="col">Files</th>
                                            <th scope="col">Actions</th>
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
                    <VerificationImageModal
                        show={checkVerificationId != null}
                        onHide={() => this.setState({ checkVerificationId: null })}
                        address={address}
                        identification={identification}
                    />

                    <Modal show={acceptID != null} onHide={() => this.setState({ acceptID: null })}>
                        <Modal.Header closeButton>
                            <Modal.Title>Do you want to accept this customer?</Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.setState({ acceptID: null })}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={this.acceptVerification}>
                                Confirm
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={declineID != null} onHide={() => this.setState({ declineID: null })}>
                        <Modal.Header closeButton>
                            <Modal.Title>Do you want to decline this customer?</Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.setState({ declineID: null })}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={this.declineVerification}>
                                Confirm
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    verifications: state.kyc.verifications,
    loading: state.kyc.loading,
    total: state.kyc.total,
    currentPage: state.kyc.currentPage,
})

export default connect(mapStateToProps, kyc.actions)(KYC)