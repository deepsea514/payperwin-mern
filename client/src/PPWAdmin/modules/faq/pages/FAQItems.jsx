import React from "react"
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import { Button, Modal, Card } from "react-bootstrap";
import { addFAQItem, deleteFAQItem, getFAQSubjectDetail, editFAQItem } from "../redux/services";
import SubjectItemModal from "../components/SubjectItemModal";

class FAQItems extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            faq_subject: null,

            modal: false,
            resMessage: '',
            modalvariant: "success",
            deleteId: null,
            addItem: false,

            editId: null,
            editTitle: null,
            editContent: null,
        };
    }

    componentDidMount() {
        this.getFAQSubjectDetail();
    }

    getFAQSubjectDetail = () => {
        const { match } = this.props;
        this.setState({ loading: true });
        getFAQSubjectDetail(match.params.id)
            .then(({ data }) => {
                this.setState({ loading: false, faq_subject: data });
            })
            .catch(() => {
                this.setState({ loading: false, faq_subject: null });
            })
    }

    addItemAction = (value, formik) => {
        const { match } = this.props;
        const { faq_subject } = this.state;
        addFAQItem(match.params.id, value)
            .then(({ data }) => {
                const { success, error, faq_item } = data;
                if (success) {
                    const items = [...faq_subject.items, faq_item];
                    this.setState({
                        modal: true,
                        addItem: null,
                        resMessage: "Item added!",
                        modalvariant: "success",
                        faq_subject: {
                            ...faq_subject,
                            items
                        }
                    });
                } else {
                    this.setState({ modal: true, addItem: null, resMessage: error, modalvariant: "danger" });
                }
            })
            .catch(() => {
                this.setState({ modal: true, addItem: null, resMessage: "Can't add item!", modalvariant: "danger" });
            });
    }

    editItemAction = (value, formik) => {
        const { editId, faq_subject } = this.state;
        editFAQItem(editId, value)
            .then(({ data }) => {
                const { success, error } = data;
                if (success) {
                    const items = faq_subject.items.map(item => {
                        if (item._id == editId) {
                            return {
                                ...item,
                                ...value
                            }
                        }
                        return item;
                    })
                    this.setState({
                        modal: true,
                        editId: null,
                        editTitle: null,
                        editContent: null,
                        resMessage: "Item saved!",
                        modalvariant: "success",
                        faq_subject: {
                            ...faq_subject,
                            items
                        }
                    });
                } else {
                    this.setState({
                        modal: true,
                        editId: null,
                        editTitle: null,
                        editContent: null,
                        resMessage: error,
                        modalvariant: "danger"
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    modal: true,
                    editId: null,
                    editTitle: null,
                    editContent: null,
                    resMessage: "Can't add item!",
                    modalvariant: "danger"
                });
            });
    }

    deleteItem = () => {
        const { match } = this.props;
        const { deleteId, faq_subject } = this.state;
        deleteFAQItem(match.params.id, deleteId)
            .then(({ data }) => {
                const { success, error } = data;
                if (success) {
                    const items = faq_subject.items.filter(item => item._id != deleteId);
                    this.setState({
                        modal: true,
                        deleteId: null,
                        resMessage: "Subject deleted!",
                        modalvariant: "success",
                        faq_subject: {
                            ...faq_subject,
                            items
                        }
                    });
                } else {
                    this.setState({ modal: true, deleteId: null, resMessage: error, modalvariant: "danger" });
                }
            })
            .catch(() => {
                this.setState({ modal: true, deleteId: null, resMessage: "Can't delete subject!", modalvariant: "danger" });
            });
    }

    render() {
        const { addItem, modal, resMessage, modalvariant, deleteId, faq_subject, loading, editTitle, editContent, editId } = this.state;

        return (
            <div className="row">
                {loading &&
                    <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                        <center>
                            <Preloader use={ThreeDots}
                                size={100}
                                strokeWidth={10}
                                strokeColor="#F0AD4E"
                                duration={800} />
                        </center>
                    </div>}
                {!loading && !faq_subject &&
                    <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                        <div className="card card-custom gutter-b">
                            <div className="card-header">
                                <div className="card-title">
                                    <h2 className="card-label">No data available</h2>
                                </div>
                                <div className="card-toolbar">
                                    <Link className="btn btn-primary ml-3" to="/">
                                        Back
                                    </Link>
                                </div>
                            </div>
                            <div className="card-body">

                            </div>
                        </div>
                    </div>}
                {faq_subject && <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">FAQ items of "{faq_subject.title}"</h3>
                            </div>
                            <div className="card-toolbar">
                                <Button variant="success" onClick={() => this.setState({ addItem: true })}>
                                    Add Item
                                </Button>
                                <Link className="btn btn-primary ml-3" to="/">
                                    Back
                                </Link>
                            </div>
                        </div>
                        <div className="card-body">
                            {faq_subject.items.map((item, index) =>
                            (
                                <Card key={index} className="mt-2">
                                    <Card.Body>
                                        <Card.Title>{item.title}</Card.Title>
                                        <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
                                        <Card.Link
                                            className="btn btn-outline-primary"
                                            onClick={() => this.setState({ editId: item._id, editTitle: item.title, editContent: item.content })}>Edit Item</Card.Link>
                                        <Card.Link
                                            className="btn btn-outline-danger"
                                            onClick={() => this.setState({ deleteId: item._id })}>Delete Item</Card.Link>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>}

                {addItem && <SubjectItemModal
                    onHide={() => this.setState({ addItem: false })}
                    show={addItem}
                    onSubmit={this.addItemAction}
                />}

                {editId && <SubjectItemModal
                    onHide={() => this.setState({ editId: null, editTitle: null, editContent: null })}
                    show={editId != null}
                    title={editTitle}
                    content={editContent}
                    onSubmit={this.editItemAction}
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
                        <Modal.Title>Do you want to delete this item?</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ deleteId: null })}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.deleteItem}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default FAQItems;