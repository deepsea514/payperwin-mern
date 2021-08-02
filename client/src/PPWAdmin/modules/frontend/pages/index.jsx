import React, { Component } from 'react';
import FeaturedSports from "../components/FeaturedSports";
import Maintenance from "../components/Maintenance";

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
                            <FeaturedSports />
                            <hr />
                            <Maintenance />
                            <hr />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}