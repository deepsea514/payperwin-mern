import React from "react"
import { ListGroup, ListGroupItem, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import CustomPagination from "../../../components/CustomPagination.jsx";
import { Link } from "react-router-dom";
import * as articles from "../redux/reducers";
import * as Yup from "yup";
import { Formik } from "formik";
import { createCategory, deleteCategory } from "../redux/services.js";


class Categories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categorySchema: Yup.object().shape({
                title: Yup.string().required("Category title is required."),
            }),
            initialValues: {
                title: ''
            },
            addModal: false,
            modal: false,
            resMessage: '',
            modalvariant: '',
            deleteId: null,
        }
    }

    componentDidMount() {
        const { getArticleCategoriesAction } = this.props;
        getArticleCategoriesAction();
    }

    showCategories = () => {
        const { categories, loading_categories } = this.props;

        if (loading_categories) {
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
        if (categories.length == 0) {
            return (
                <center>
                    <h3>No Categories</h3>
                </center>
            );
        }

        return (
            <div className="row">
                {categories.map(category => <div key={category._id} className="col-md-4 p-3" >
                    <div style={{ border: '1px solid #ebedf3' }} className="p-3">
                        {category.title}
                        <a className="float-right" style={{ cursor: 'pointer' }} onClick={() => this.setState({ deleteId: category._id })}>
                            <i className='fas fa-trash' />
                        </a>
                    </div>
                </div>)}
            </div>
        )
    }

    addCategory = (values, formik) => {
        const { getArticleCategoriesAction } = this.props;
        createCategory(values)
            .then(() => {
                formik.setSubmitting(false);
                this.setState({ modal: true, addModal: false, resMessage: "Successfully added!", modalvariant: "success" });
                getArticleCategoriesAction();
            })
            .catch(() => {
                formik.setSubmitting(false);
                this.setState({ modal: true, addModal: false, resMessage: "Addition Failed!", modalvariant: "danger" });
            })
    }

    deleteCategory = () => {
        const { getArticleCategoriesAction } = this.props;
        const { deleteId } = this.state
        deleteCategory(deleteId)
            .then(() => {
                this.setState({ modal: true, deleteId: null, resMessage: "Successfully deleted!", modalvariant: "success" });
                getArticleCategoriesAction();
            })
            .catch(() => {
                this.setState({ modal: true, deleteId: null, resMessage: "Deletion Failed!", modalvariant: "danger" });
            })
    }

    getInputClasses = (formik, fieldname) => {
        if (formik.touched[fieldname] && formik.errors[fieldname]) {
            return "is-invalid";
        }
        if (formik.touched[fieldname] && !formik.errors[fieldname]) {
            return "is-valid";
        }
        return "";
    };

    render() {
        const { addModal, initialValues, categorySchema, modal, resMessage, modalvariant, deleteId } = this.state;
        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Categories</h3>
                            </div>
                            <div className="card-toolbar">
                                <Link to="/" className="btn btn-primary font-weight-bolder font-size-sm">
                                    Back
                                </Link>
                                <button className="btn btn-success font-weight-bolder font-size-sm ml-3" onClick={() => this.setState({ addModal: true })}>
                                    <i className="fas fa-list"></i>&nbsp; Add a Category
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            {this.showCategories()}

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
                                    <Modal.Title>Add a Categiry</Modal.Title>
                                </Modal.Header>
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={categorySchema}
                                    onSubmit={this.addCategory}>
                                    {(formik) => {
                                        return <form onSubmit={formik.handleSubmit}>
                                            <Modal.Body>
                                                <div className="form-group">
                                                    <label>Category Title<span className="text-danger">*</span></label>
                                                    <input name="title" placeholder="Enter Category Title"
                                                        className={`form-control ${this.getInputClasses(
                                                            formik,
                                                            "title"
                                                        )}`}
                                                        {...formik.getFieldProps("title")}
                                                    />
                                                    {formik.touched.title && formik.errors.title ? (
                                                        <div className="invalid-feedback">
                                                            {formik.errors.title}
                                                        </div>
                                                    ) : null}
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
                                    <Modal.Title>Do you want to delete this Category?</Modal.Title>
                                </Modal.Header>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => this.setState({ deleteId: null })}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" onClick={this.deleteCategory}>
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
    categories: state.articles.categories,
    loading_categories: state.articles.loading_categories,
})


export default connect(mapStateToProps, articles.actions)(Categories)