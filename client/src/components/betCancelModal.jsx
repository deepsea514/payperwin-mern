import React from "react";
import { FormattedMessage } from 'react-intl';

export default class BetCancelModal extends React.Component {
    render() {
        const { betAmount, onClose, onProceed, submitting } = this.props;
        return (
            <div className="modal confirmation">
                <div className="background-closer bg-modal" onClick={onClose} />
                <div className="col-in">
                    <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={onClose} />
                    <div>
                        <b><FormattedMessage id="COMPONENTS.CANCEL_BET_TITLE" /></b>
                        <hr />
                        <p>
                            <FormattedMessage id="COMPONENTS.CANCEL_BET_DES" values={{ amount: (betAmount * 0.15).toFixed(2) }} />
                        </p>
                        <div className="text-right">
                            <button className={`form-button ${submitting ? 'is-loading' : ''}`} onClick={onProceed} disabled={submitting}> <FormattedMessage id="COMPONENTS.PROCEED" /> </button>
                            <button className="form-button ml-2" onClick={onClose} disabled={submitting}> <FormattedMessage id="PAGES.TRANSACTIONHISTORY.CANCEL" /> </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}