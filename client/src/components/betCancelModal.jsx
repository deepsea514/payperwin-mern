import React from "react";

export default class BetCancelModal extends React.Component {
    render() {
        const { betAmount, onClose, onProceed, submitting } = this.props;
        return (
            <div className="modal confirmation">
                <div className="background-closer bg-modal" onClick={onClose} />
                <div className="col-in">
                    <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={onClose} />
                    <div>
                        <b>Cancel a Bet.</b>
                        <hr />
                        <p>
                            You can cancel a bet before the game starts with a 15% penalty.
                            To cancel this bet, a ${(betAmount * 0.15).toFixed(2)} fee will be deducted from your original wager.
                        </p>
                        <div className="text-right">
                            <button className={`form-button ${submitting ? 'is-loading' : ''}`} onClick={onProceed} disabled={submitting}> Proceed </button>
                            <button className="form-button ml-2" onClick={onClose} disabled={submitting}> Cancel </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}