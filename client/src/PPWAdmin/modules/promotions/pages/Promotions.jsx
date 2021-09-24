import React from "react"
import { Dropdown, DropdownButton, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import * as promotions from "../redux/reducers";
import dateformat from "dateformat";
import CustomPagination from "../../../components/CustomPagination.jsx";
import PromotionModal from "../components/PromotionModal";
import { createPromotion } from "../redux/services";
import config from "../../../../../../config.json";
const PromotionTypes = config.PromotionTypes;
const PromotionFor = config.PromotionFor;

class Promotions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 25,
            addModal: false,
            modal: false,
            resMessage: '',
            modalvariant: ''
        }
    }

    componentDidMount() {
        const { getPromotionsAction } = this.props;
        getPromotionsAction();
    }

    getDateFormat = (date) => {
        return dateformat(new Date(date), "yyyy-mm-dd HH:MM");
    }

    tableBody = () => {
        const { promotions, loading } = this.props;

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
        if (promotions.length == 0) {
            return (
                <tr>
                    <td colSpan="7" align="center">
                        <h3>No Promotions</h3>
                    </td>
                </tr>
            );
        }

        return promotions.map((promotion, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{promotion.name}</td>
                <td>{PromotionTypes[promotion.type].name}</td>
                <td>{promotion.number_of_usage}</td>
                <td>{promotion.usage_limit}</td>
                <td>{PromotionFor[promotion.usage_for]}</td>
                <td><Link to={`/${promotion._id}/detail`} ><i className="fas fa-eye"></i></Link></td>
            </tr>
        ));
    }

    onPageChange = (page) => {
        const { getPromotionsAction, currentPage } = this.props;
        if (page != currentPage)
            getPromotionsAction(page);
    }

    addPromotion = (values, formik) => {
        const { getPromotionsAction } = this.props;
        createPromotion(values)
            .then(() => {
                formik.setSubmitting(false);
                this.setState({ modal: true, addModal: false, resMessage: "Successfully added!", modalvariant: "success" });
                getPromotionsAction();
            })
            .catch(() => {
                formik.setSubmitting(false);
                this.setState({ modal: true, addModal: false, resMessage: "Addition Failed!", modalvariant: "danger" });
            });
    }

    render() {
        const { perPage, addModal, modal, modalvariant, resMessage } = this.state;
        const { total, currentPage } = this.props;
        const totalPages = total ? (Math.floor((total - 1) / perPage) + 1) : 1;

        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Promotions</h3>
                            </div>
                            <div className="card-toolbar">
                                <Button className="btn btn-success font-weight-bolder font-size-sm" onClick={() => this.setState({ addModal: true })}>
                                    <i className="fas fa-credit-card"></i>&nbsp; Add Promotion
                                </Button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Type</th>
                                            <th scope="col">Number of Usage</th>
                                            <th scope="col">Usage Limit</th>
                                            <th scope="col">Usage For</th>
                                            <th scope="col">Details</th>
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
                <PromotionModal
                    show={addModal}
                    onHide={() => this.setState({ addModal: false })}
                    title="Add AutoBet User"
                    onSubmit={this.addPromotion}
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
            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    promotions: state.promotions.promotions,
    loading: state.promotions.loading,
    total: state.promotions.total,
    currentPage: state.promotions.currentPage,
})

export default connect(mapStateToProps, promotions.actions)(Promotions)