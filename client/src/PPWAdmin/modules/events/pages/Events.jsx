import React from "react"

export default class Events extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="col-lg-12 col-xxl-12 order-1 order-xxl-12">
                    <div className="card card-custom gutter-b">
                        <div className="card-header">
                            <div className="card-title">
                                <h3 className="card-label">Event</h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Name Of Event</th>
                                            <th scope="col">Sport Category</th>
                                            <th scope="col">Start Date/Time</th>
                                            <th scope="col">Final Score</th>
                                            <th scope="col">Total Money Bet</th>
                                            <th scope="col">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Test Event</td>
                                            <td>Test Category</td>
                                            <td>01/17/2021 10:00 AM</td>
                                            <td>-</td>
                                            <td>$100.00</td>
                                            <td>
                                                <span className="label label-warning label-inline font-weight-lighter mr-2">Started</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Test Event</td>
                                            <td>Test Category</td>
                                            <td>01/17/2021 10:00 AM</td>
                                            <td>2</td>
                                            <td>$100.00</td>
                                            <td>
                                                <span className="label label-success label-inline font-weight-lighter mr-2">Finished</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Test Event</td>
                                            <td>Test Category</td>
                                            <td>01/17/2021 10:00 AM</td>
                                            <td>-</td>
                                            <td>$100.00</td>
                                            <td>
                                                <span className="label label-danger label-inline font-weight-lighter mr-2">Cancelled</span>
                                            </td>
                                        </tr>
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