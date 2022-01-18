import React, { Component } from "react";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Dropdown, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import dateformat from "dateformat";
import { deletePromotionBanner, loadPromotionBanners, updatePromotionBanner, uploadPromotionBanner } from "../redux/services";
import AddPromotionBannerModal from "../components/AddPromotionBannerModal";
import _env from '../../../../env.json';
import EditPromotionBannerModal from "../components/EditPromotionBannerModal";
const serverUrl = _env.appUrl;

export default class PromotionBanners extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addModal: false,
            loading: false,
            banners: [],
            deleteId: null,
            editId: null,

            modal: false,
            resMessage: '',
            modalvariant: '',
        }
    }

    componentDidMount() {
        this.loadBanners();
    }

    loadBanners = () => {
        this.setState({ loading: true });
        loadPromotionBanners()
            .then(({ data }) => {
                this.setState({
                    banners: data,
                    loading: false,
                })
            })
            .catch(() => {
                this.setState({
                    banners: [],
                    loading: false,
                })
            })
    }

    getDate = (date) => {
        return dateformat(new Date(date), "mediumDate");
    }

    renderTableBody = () => {
        const { loading, banners } = this.state;
        if (loading) {
            return (
                <tr>
                    <td colSpan="7" align="center">
                        <Preloader use={ThreeDots}
                            size={100}
                            strokeWidth={10}
                            strokeColor="#F0AD4E"
                            duration={800} />
                    </td>
                </tr>
            );
        }
        if (banners.length == 0) {
            return (
                <tr>
                    <td colSpan="7" align="center">
                        <h3>No Banners</h3>
                    </td>
                </tr>
            );
        }

        return banners.map((banner, index) => {
            return (
                <tr key={index}>
                    <th scope="col">{index + 1}</th>
                    <th scope="col">
                        <div>
                            {banner.type == 'image' &&
                                <img src={`${serverUrl}/static/${banner.path}`}
                                    style={{ width: '150px', height: 'auto', display: 'block' }} />}

                            {banner.type == 'video' &&
                                <video src={`${serverUrl}/static/${banner.path}`}
                                    playsInline
                                    controls={true}
                                    style={{ width: '150px', height: 'auto', display: 'block' }} />}
                        </div>
                    </th>
                    <th scope="col">{this.getDate(banner.createdAt)}</th>
                    <th scope="col">{banner.type}</th>
                    <th scope="col">{banner.priority}</th>
                    <th scope="col">
                        <Dropdown>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                Actions
                            </Dropdown.Toggle>

                            <Dropdown.Menu popperConfig={{ strategy: "fixed" }}>
                                <Dropdown.Item onClick={() => this.setState({ editId: banner })}><i className="fas fa-edit"></i>&nbsp; Edit</Dropdown.Item>
                                <Dropdown.Item onClick={() => this.setState({ deleteId: banner._id })}><i className="fas fa-trash"></i>&nbsp; Delete</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </th>
                </tr>
            );
        })
    }

    addPromotionBanner = (values, formik) => {
        let data = new FormData();
        data.append('file', values.file, values.file.name);
        data.append('priority', values.priority);
        uploadPromotionBanner(data)
            .then(() => {
                formik.setSubmitting(false);
                this.setState({ modal: true, addModal: null, resMessage: "Successfully uploaded!", modalvariant: "success" });
                this.loadBanners();
            })
            .catch(() => {
                formik.setSubmitting(false);
                this.setState({ modal: true, addModal: null, resMessage: "Upload Failed!", modalvariant: "danger" });
            })
    }

    deletePromotionBanner = () => {
        const { deleteId } = this.state;
        deletePromotionBanner(deleteId)
            .then(() => {
                this.setState({ modal: true, deleteId: null, resMessage: "Successfully deleted!", modalvariant: "success" });
                this.loadBanners();
            })
            .catch(() => {
                this.setState({ modal: true, deleteId: null, resMessage: "Delete Failed!", modalvariant: "danger" });
            })
    }

    editPromotionBanner = (values, formik) => {
        const { editId } = this.state;
        updatePromotionBanner(editId._id, values)
            .then(() => {
                formik.setSubmitting(false);
                this.setState({ modal: true, editId: null, resMessage: "Successfully updated!", modalvariant: "success" });
                this.loadBanners();
            })
            .catch(() => {
                formik.setSubmitting(false);
                this.setState({ modal: true, editId: null, resMessage: "Update Failed!", modalvariant: "danger" });
            })
    }

    render() {
        const { addModal, modal, resMessage, modalvariant, deleteId, editId } = this.state;

        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Promotion Banners</h3>
                            </div>
                            <div className="card-toolbar">
                                <Link to={"/"} className="btn btn-success font-weight-bolder font-size-sm mr-2">
                                    Back
                                </Link>
                                <Button className="btn btn-success font-weight-bolder font-size-sm" onClick={() => this.setState({ addModal: true })}>
                                    <i className="fas fa-credit-card"></i>&nbsp; Add Banner
                                </Button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Preview</th>
                                            <th scope="col">Created At</th>
                                            <th scope="col">Type</th>
                                            <th scope="col">Priority</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderTableBody()}
                                    </tbody>
                                </table>
                            </div>
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

                    <AddPromotionBannerModal
                        show={addModal}
                        onHide={() => this.setState({ addModal: false })}
                        onSubmit={this.addPromotionBanner}
                    />

                    {editId != null && < EditPromotionBannerModal
                        show={editId != null}
                        onHide={() => this.setState({ editId: null })}
                        priority={editId.priority}
                        onSubmit={this.editPromotionBanner}
                    />}

                    <Modal show={deleteId != null} onHide={() => this.setState({ deleteId: null })}>
                        <Modal.Header closeButton>
                            <Modal.Title>Do you want to delete this banner?</Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.setState({ deleteId: null })}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={this.deletePromotionBanner}>
                                Confirm
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        );
    }
}
