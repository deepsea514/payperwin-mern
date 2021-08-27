import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder';

class AutobetSettings extends Component {
    componentDidMount() { }

    componentDidUpdate() {
        const { user, history } = this.props;
        if (user && !user.autobet) {
            history.push('/');
        }
    }

    render() {
        setTitle({ pageTitle: 'Autobet Settings' });
        return (
            <React.Fragment>
                <div className="col-in">
                    <h1 className="main-heading-in">Autobet Settings</h1>
                    <div className="main-cnt text-center">
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default AutobetSettings;