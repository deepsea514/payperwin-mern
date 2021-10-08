import React from "react";

export default class SBModal extends React.Component {
    render() {
        const { sportsbookInfo, onClose, onAccept } = this.props;
        return (
            <div className="modal confirmation">
                <div className="background-closer bg-modal" onClick={onClose} />
                <div className="col-in">
                    <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={onClose} />
                    <div>
                        <b>BET ON SPORTSBOOK</b>
                        <hr />
                        <p>
                            Peer to Peer betting is not available for this line. This is an instant bet and can be forwarded to a Sportsbook with the following new odds.
                        </p>
                        <b>{sportsbookInfo.name}: {sportsbookInfo.type}@{sportsbookInfo.originOdds[sportsbookInfo.pick]}</b>
                        <div className="text-right">
                            <button className="form-button ml-2" onClick={onAccept}> Accept </button>
                            <button className="form-button ml-2" onClick={onClose}> Cancel </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}