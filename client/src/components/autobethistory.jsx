import React, { Component } from 'react';

class AutobetHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <>
                <div className="card card-custom">
                    {/* Header */}
                    <div className="card-header align-items-center border-0 mt-4">
                        <h3 className="card-title align-items-start flex-column">
                            <span className="font-weight-bolder text-dark">Recent Matches</span>
                            <span className="text-muted mt-3 font-weight-bold font-size-sm">
                                10 Matches
                            </span>
                        </h3>
                    </div>
                    {/* Body */}
                    <div className="card-body pt-4">
                        <div className="timeline timeline-6 mt-3">
                            <div className="timeline-item align-items-start">
                                <div className="timeline-label font-weight-bolder text-dark-75 font-size-sm">
                                    08:42
                                </div>

                                <div className="timeline-badge">
                                    <i className="fa fa-genderless text-warning icon-xl"></i>
                                </div>

                                <div className="font-weight-mormal font-size-sm timeline-content text-muted pl-3">
                                    Outlines keep you honest. And keep structure
                                </div>
                            </div>

                            <div className="timeline-item align-items-start">
                                <div className="timeline-label font-weight-bolder text-dark-75 font-size-sm">
                                    10:00
                                </div>

                                <div className="timeline-badge">
                                    <i className="fa fa-genderless text-success icon-xl"></i>
                                </div>

                                <div className="timeline-content d-flex">
                                    <span className="font-weight-bolder text-dark-75 pl-3 font-size-sm">
                                        AEOL meeting
                                    </span>
                                </div>
                            </div>

                            <div className="timeline-item align-items-start">
                                <div className="timeline-label font-weight-bolder text-dark-75 font-size-sm">
                                    14:37
                                </div>

                                <div className="timeline-badge">
                                    <i className="fa fa-genderless text-danger icon-xl"></i>
                                </div>

                                <div className="timeline-content font-weight-bolder font-size-sm text-dark-75 pl-3">
                                    Make deposit{` `}
                                    <a href="#" className="text-primary">
                                        USD 700
                                    </a>
                                    . to ESL
                                </div>
                            </div>

                            <div className="timeline-item align-items-start">
                                <div className="timeline-label font-weight-bolder text-dark-75 font-size-sm">
                                    16:50
                                </div>

                                <div className="timeline-badge">
                                    <i className="fa fa-genderless text-primary icon-xl"></i>
                                </div>

                                <div className="timeline-content font-weight-mormal font-size-sm text-muted pl-3">
                                    Indulging in poorly driving and keep structure keep great
                                </div>
                            </div>

                            <div className="timeline-item align-items-start">
                                <div className="timeline-label font-weight-bolder text-dark-75 font-size-sm">
                                    21:03
                                </div>

                                <div className="timeline-badge">
                                    <i className="fa fa-genderless text-danger icon-xl"></i>
                                </div>

                                <div className="timeline-content font-weight-bolder text-dark-75 pl-3 font-size-sm">
                                    New order placed{` `}
                                    <a href="#" className="text-primary">
                                        #XF-2356
                                    </a>
                                    .
                                </div>
                            </div>

                            <div className="timeline-item align-items-start">
                                <div className="timeline-label font-weight-bolder text-dark-75 font-size-sm">
                                    23:07
                                </div>

                                <div className="timeline-badge">
                                    <i className="fa fa-genderless text-info icon-xl"></i>
                                </div>

                                <div className="timeline-content font-weight-mormal font-size-sm text-muted pl-3">
                                    Outlines keep and you honest. Indulging in poorly driving
                                </div>
                            </div>

                            <div className="timeline-item align-items-start">
                                <div className="timeline-label font-weight-bolder text-dark-75 font-size-sm">
                                    16:50
                                </div>

                                <div className="timeline-badge">
                                    <i className="fa fa-genderless text-primary icon-xl"></i>
                                </div>

                                <div className="timeline-content font-weight-mormal font-size-sm text-muted pl-3">
                                    Indulging in poorly driving and keep structure keep great
                                </div>
                            </div>

                            <div className="timeline-item align-items-start">
                                <div className="timeline-label font-weight-bolder text-dark-75 font-size-sm">
                                    21:03
                                </div>

                                <div className="timeline-badge">
                                    <i className="fa fa-genderless text-danger icon-xl"></i>
                                </div>

                                <div className="timeline-content font-weight-bolder font-size-sm text-dark-75 pl-3">
                                    New order placed {` `}
                                    <a href="#" className="text-primary">
                                        #XF-2356
                                    </a>
                                    .
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default AutobetHistory;