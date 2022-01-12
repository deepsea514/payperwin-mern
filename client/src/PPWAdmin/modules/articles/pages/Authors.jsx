import React, { createRef } from "react"
import { Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import * as articles from "../redux/reducers";
import * as Yup from "yup";
import { Formik } from "formik";
import { createAuthor, deleteAuthor } from "../redux/services.js";
import { getInputClasses } from "../../../../helpers/getInputClasses";
import Resizer from "react-image-file-resizer";

class Authors extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authorSchema: Yup.object().shape({
                name: Yup.string().required("Author Name is required."),
                logo: Yup.string().required("Author logo is required."),
            }),
            initialValues: {
                name: '',
                logo: ''
            },
            addModal: false,
            modal: false,
            resMessage: '',
            modalvariant: '',
            deleteId: null,
        }
        this.logoRef = createRef();
    }

    componentDidMount() {
        const { getArticleAuthorsAction } = this.props;
        getArticleAuthorsAction();
    }

    clickUploadButton = () => {
        this.logoRef.current.click();
    }

    handleFileUpload = async (e, formik) => {
        const file = e.target.files[0];
        const image = await this.resizeFile(file);
        formik.setFieldValue('logo', image);
    }

    resizeFile = (file) => {
        return new Promise((resolve) => {
            Resizer.imageFileResizer(
                file, 100, 100, "png", 100, 0,
                (uri) => resolve(uri),
                "base64", 100, 100
            );
        });
    }

    showAuthors = () => {
        const { authors, loading_authors } = this.props;

        if (loading_authors) {
            return (
                <center>
                    <Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} />
                </center>
            );
        }
        if (authors.length == 0) {
            return (
                <center>
                    <h3>No Authors</h3>
                </center>
            );
        }

        return (
            <div className="row">
                {authors.map(author => (
                    <div key={author._id} className="col-md-4 p-3" >
                        <div style={{ border: '1px solid #ebedf3' }} className="p-3 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <img src={author.logo} style={{ width: '40px', height: '40px', display: 'block' }} />
                                <span className="ml-4">{author.name}</span>
                            </div>
                            <a className="float-right" style={{ cursor: 'pointer' }} onClick={() => this.setState({ deleteId: author._id })}>
                                <i className='fas fa-trash' />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    addAuthor = (values, formik) => {
        const { getArticleAuthorsAction } = this.props;
        createAuthor(values)
            .then(() => {
                formik.setSubmitting(false);
                this.setState({ modal: true, addModal: false, resMessage: "Successfully added!", modalvariant: "success" });
                getArticleAuthorsAction();
            })
            .catch(() => {
                formik.setSubmitting(false);
                this.setState({ modal: true, addModal: false, resMessage: "Addition Failed!", modalvariant: "danger" });
            })
    }

    deleteAuthor = () => {
        const { getArticleAuthorsAction } = this.props;
        const { deleteId } = this.state
        deleteAuthor(deleteId)
            .then(() => {
                this.setState({ modal: true, deleteId: null, resMessage: "Successfully deleted!", modalvariant: "success" });
                getArticleAuthorsAction();
            })
            .catch(() => {
                this.setState({ modal: true, deleteId: null, resMessage: "Deletion Failed!", modalvariant: "danger" });
            })
    }

    render() {
        const { addModal, initialValues, authorSchema, modal, resMessage, modalvariant, deleteId } = this.state;
        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Authors</h3>
                            </div>
                            <div className="card-toolbar">
                                <Link to="/" className="btn btn-primary font-weight-bolder font-size-sm">
                                    Back
                                </Link>
                                <button className="btn btn-success font-weight-bolder font-size-sm ml-3" onClick={() => this.setState({ addModal: true })}>
                                    <i className="fas fa-list"></i>&nbsp; Add a Author
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            {this.showAuthors()}

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

                            {addModal && <Modal show={addModal} onHide={() => this.setState({ addModal: false })}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Add a Aurhot</Modal.Title>
                                </Modal.Header>
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={authorSchema}
                                    onSubmit={this.addAuthor}>
                                    {(formik) => {
                                        return <form onSubmit={formik.handleSubmit}>
                                            <Modal.Body>
                                                <div className="form-group">
                                                    <label>Author Name<span className="text-danger">*</span></label>
                                                    <input name="name" placeholder="Enter Author Name"
                                                        className={`form-control ${getInputClasses(formik, "name")}`}
                                                        {...formik.getFieldProps("name")}
                                                    />
                                                    {formik.touched.name && formik.errors.name ? (
                                                        <div className="invalid-feedback">
                                                            {formik.errors.name}
                                                        </div>
                                                    ) : null}
                                                </div>
                                                <div className="form-row form-group">
                                                    <div className="col">
                                                        <button type="button" className="btn btn-success mr-2" onClick={this.clickUploadButton}>Upload Logo File</button>
                                                        <input ref={this.logoRef}
                                                            className={`form-control ${getInputClasses(formik, "logo")}`}
                                                            onChange={(e) => this.handleFileUpload(e, formik)} type="file"
                                                            style={{ display: "none" }} accept="image/x-png,image/gif,image/jpeg" />
                                                        {formik.touched.logo && formik.errors.logo ? (
                                                            <div className="invalid-feedback">
                                                                {formik.errors.logo}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                    <div className="col">
                                                        <img src={formik.values.logo} style={{ width: '60px', height: '60px', display: 'block' }} />
                                                    </div>
                                                </div>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="light-primary" onClick={() => this.setState({ addModal: false })}>
                                                    Cancel
                                                </Button>
                                                <Button variant="primary" type="submit" disabled={formik.isSubmitting}>
                                                    Save
                                                </Button>
                                            </Modal.Footer>
                                        </form>
                                    }}
                                </Formik>
                            </Modal>}

                            <Modal show={deleteId != null} onHide={() => this.setState({ deleteId: null })}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Do you want to delete this Author?</Modal.Title>
                                </Modal.Header>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => this.setState({ deleteId: null })}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" onClick={this.deleteAuthor}>
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
    authors: state.articles.authors,
    loading_authors: state.articles.loading_authors,
})

export default connect(mapStateToProps, articles.actions)(Authors)