import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';
import AutobetHistory from '../components/autobethistory';
import AutobetSummary from '../components/autobetsummary';

class AutobetDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        setTitle({ pageTitle: 'Autobet Dashboard' });
    }

    componentDidUpdate() {
        const { user, history } = this.props;
        if (user && !user.autobet) {
            history.push('/');
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="col-in">
                    <h1 className="main-heading-in">Autobet Dashboard</h1>
                    <div className="main-cnt">
                        <div className="row">
                            <div className="col-md-7">
                                <AutobetHistory />
                            </div>
                            <div className="col-md-5">
                                <AutobetSummary />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default AutobetDashboard;