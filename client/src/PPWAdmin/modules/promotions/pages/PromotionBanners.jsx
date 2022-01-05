import React, { Component } from "react";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Dropdown, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import dateformat from "dateformat";
import { loadPromotionBanners } from "../redux/services";

export default class PromotionBanners extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addModal: false,
            loading: false,
            banners: [],
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
    }

    render() {
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
                </div>
            </div>
        );
    }
}
