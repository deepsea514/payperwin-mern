import React from "react";
import { connect } from "react-redux";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Link } from "react-router-dom";
import dateformat from "dateformat";
import * as promotions from "../redux/reducers";
import { getPromotionDetail } from "../redux/services";
import config from "../../../../../../config.json";
const PromotionTypes = config.PromotionTypes;
const PromotionFor = config.PromotionFor;

class PromotionDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            loading: false,
            promotion: null,
        }
    }

    componentDidMount() {
        const { id } = this.state;
        this.setState({ loading: true });
        getPromotionDetail(id)
            .then(({ data }) => {
                this.setState({ loading: false, promotion: data });
            })
            .catch(() => {
                this.setState({ loading: false, promotion: null });
            });
    }

    getDate = (date) => {
        return dateformat(new Date(date), "mediumDate");
    }

    renderPromotionLogs = (logs) => {
        return logs.map((log, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{log.user.username}</td>
                <td>{log.ip_address}</td>
                <td>{this.geetDate(log.createdAt)}</td>
            </tr>
        ))
    }

    render() {
        const { loading, promotion, } = this.state;
        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-11 order-xxl-12 text-center">
                    {!loading && promotion == null && <h1>No data available</h1>}
                    {loading && <center className="mt-5"><Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} /></center>}

                    {!loading && promotion && <div className="card card-custom gutter-b text-left">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Promotion Detail</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <th>Name</th>
                                            <td>{promotion.name}</td>
                                            <th>Description</th>
                                            <td>{promotion.description}</td>
                                        </tr>
                                        <tr>
                                            <th>Type</th>
                                            <td>{PromotionTypes[promotion.type].name}</td>
                                            <th>Expiration Date</th>
                                            <td>{this.getDate(promotion.expiration_date)}</td>
                                        </tr>
                                        <tr>
                                            <th>Usage per Same Customer</th>
                                            <td>{promotion.number_of_usage == -1 ? "Infinitive" : (promotion.number_of_usage + " times")}</td>
                                            <th>No. of Unique Redemptions</th>
                                            <td>{promotion.usage_limit} times Per User</td>
                                        </tr>
                                        <tr>
                                            <th>Use For</th>
                                            <td>{PromotionFor[promotion.usage_for]}</td>
                                            {promotion.type == '_100_SignUpBonus' && <>
                                                <th>Maximum match amount</th>
                                                <td>${promotion.value.toFixed(2)}</td>
                                            </>}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="table-responsive mt-3">
                                <h3>Promotion Usage Logs</h3>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>User</th>
                                            <th>Ip Address</th>
                                            <th>Used in</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card-footer">
                            <Link to="/" className="btn btn-secondary">Cancel</Link>
                        </div>
                    </div>}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps, promotions)(PromotionDetail)