import React, { Component } from 'react';
import FeaturedSports from "../components/FeaturedSports";
import Maintenance from "../components/Maintenance";
import TopSports from "../components/TopSports";
import ToggleBet from "../components/ToggleBet";
import Message from '../components/Message';
import Banner from '../components/Banner';

export default class FrontendManageModule extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Frontend Management</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <Maintenance />
                                    <hr />
                                </div>
                                <div className="col-md-6">
                                    <ToggleBet />
                                    <hr />
                                </div>
                                <div className="col-md-6">
                                    <TopSports />
                                    <hr />
                                </div>
                                <div className="col-md-6">
                                    <FeaturedSports />
                                    <hr />
                                </div>
                                <div className="col-md-6">
                                    <Message />
                                    <hr />
                                </div>
                                <div className="col-md-6">
                                    <Banner />
                                    <hr />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}