import React from "react";

export default class BasicModal extends React.Component {
    getTitle = () => {
        const { showHelp } = this.props;
        switch (showHelp) {
            case 'moneyline':
                return 'MONEYLINE';
            case 'spread':
                return 'POINT SPREAD';
            case 'total':
            default:
                return 'TOTAL POINTS';
        }
    }

    render() {
        const { onClose, showHelp } = this.props;
        return (
            <div className="modal confirmation">
                <div className="background-closer bg-modal" onClick={onClose} />
                <div className="col-in">
                    <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={onClose} />
                    <div>
                        <b>{this.getTitle()}</b>
                        <hr />
                        {showHelp == 'moneyline' && <p>
                            The money line is simply choosing the outright winner, which team will win the the game.
                        </p>}
                        {showHelp == 'spread' && <p>
                            The spread, also referred to as the line, is used to even the odds between two unevenly matched teams.
                            Each team is + plus  or  - minus  points. The winner is based on the score with these points added or taken away, not the actual score.
                        </p>}
                        {showHelp == 'total' && <p>
                            This is a bet on the total number of points scored by both teams.
                        </p>}
                        <div className="text-right">
                            <button className="form-button ml-2" onClick={onClose}> OK </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}