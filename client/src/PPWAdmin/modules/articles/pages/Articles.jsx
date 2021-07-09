import React from "react"
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import CustomPagination from "../../../components/CustomPagination.jsx";
import { Link } from "react-router-dom";
import * as articles from "../redux/reducers";
import dateformat from "dateformat";
import { deleteArticle } from "../redux/services.js";

class Articles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 25,
            modal: false,
            resMessage: '',
            modalvariant: '',
            deleteId: null,
        }
    }

    componentDidMount() {
        const { getArticlesAction } = this.props;
        getArticlesAction();
    }

    tableBody = () => {
        const { article_drafts, loading_drafts } = this.props;

        if (loading_drafts) {
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
        if (article_drafts.length == 0) {
            return (
                <tr>
                    <td colSpan="11" align="center">
                        <h3>No Drafts</h3>
                    </td>
                </tr>
            );
        }

        return article_drafts.map((article, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td><img src={article.logo} width="60" height="30" /></td>
                <td>{article.title}</td>
                <td>{this.getDateFormat(article.createdAt)}</td>
                <td>
                    <DropdownButton title="Actions">
                        <Dropdown.Item as={Link} to={`/edit/${article._id}`}><i className="fas fa-edit"></i>&nbsp; Edit</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.setState({ deleteId: article._id })}><i className="fas fa-trash"></i>&nbsp; Delete Draft</Dropdown.Item>
                    </DropdownButton>
                </td>
            </tr>
        ));
    }

    getDateFormat = (date) => {
        return dateformat(new Date(date), "yyyy-mm-dd HH:MM");
    }

    onPageChange = (page) => {
        const { getArticlesAction } = this.props;
        getArticlesAction(page);
    }

    deleteArticle = () => {
        const { getArticlesAction } = this.props;
        const { deleteId } = this.state;
        deleteArticle(deleteId)
            .then(() => {
                this.setState({ modal: true, deleteId: null, resMessage: "Successfully deleted!", modalvariant: "success" });
                getArticlesAction();
            })
            .catch(() => {
                this.setState({ modal: true, deleteId: null, resMessage: "Deletion Failed!", modalvariant: "danger" });
            })
    }

    render() {
        const { perPage, modal, resMessage, modalvariant, deleteId } = this.state;
        const { total, currentPage } = this.props;
        const totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;

        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Article Drafts</h3>
                            </div>
                            <div className="card-toolbar">
                                <Link to="/categories" className="btn btn-success font-weight-bolder font-size-sm">
                                    <i className="fas fa-list"></i>&nbsp; Categories
                                </Link>
                                <Link to="/create" className="btn btn-success font-weight-bolder font-size-sm ml-3">
                                    <i className="fas fa-newspaper"></i>&nbsp; Create a New Article
                                </Link>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col"></th>
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
                                    <Button variant="primary" onClick={this.deleteArticle}>
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
    article_drafts: state.articles.article_drafts,
    loading_drafts: state.articles.loading_drafts,
    total: state.articles.total_drafts,
    currentPage: state.articles.currentPage_drafts,
})


export default connect(mapStateToProps, articles.actions)(Articles)