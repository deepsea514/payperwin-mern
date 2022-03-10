import React from "react";
import { FormattedMessage } from 'react-intl';

export default class CustomBetJoinModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: 0,
            error: '',
        }
    }

    onProceed = () => {
        const { amount } = this.state;
        if (amount < 100) {
            this.setState({ error: 'You should stake at least 100 CAD' });
        }
        const { onProceed } = this.props;
        onProceed(amount);
    }

    render() {
        const { onClose } = this.props;
        const { amount, error } = this.state;
        return (
            <div className="modal confirmation">
                <div className="background-closer bg-modal" onClick={onClose} />
                <div className="col-in">
                    <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={onClose} />
                    <div>
                        <b>Join High Staker</b>
                        <hr />
                        <div className="row">
                            <div className="col-12 form-group">
                                <label>Risk Amount (CAD)</label>
                                <input type="number"
                                    className="form-control"
                                    value={amount}
                                    onChange={(evt) => this.setState({ amount: evt.target.value, error: '' })}
                                />
                                {error && <span className="text-danger">{error}</span>}
                            </div>
                        </div>
                        <div className="text-right">
                            <button className="form-button" onClick={this.onProceed}> <FormattedMessage id="COMPONENTS.PROCEED" /> </button>
                            <button className="form-button ml-2" onClick={onClose}> <FormattedMessage id="PAGES.TRANSACTIONHISTORY.CANCEL" /> </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}