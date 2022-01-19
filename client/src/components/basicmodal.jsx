import React from "react";

export default class BasicModal extends React.Component {
    render() {
        const { onClose } = this.props;
        return (
            <div className="modal confirmation">
                <div className="background-closer bg-modal" onClick={onClose} />
                <div className="col-in">
                    <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={onClose} />
                    <div>
                        <b>BET TYPE</b>
                        <hr />
                        <p>
                            <b>MONEYLINE:</b> The money line is simply choosing the outright winner, which team will win the the game.
                        </p>
                        <p>
                            <b>POINT SPREAD:</b> The spread, also referred to as the line, is used to even the odds between two unevenly matched teams.
                        </p>
                        <p>
                            <b>TOTAL POINTS:</b> This is a bet on the total number of points scored by both teams.
                        </p>
                        <div className="text-right">
                            <button className="form-button ml-2" onClick={onClose}> OK </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}