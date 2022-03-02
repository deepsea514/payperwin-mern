import React from "react";
import { FormattedMessage } from 'react-intl';

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
                            <FormattedMessage id="COMPONENTS.MONEYLINE_EXPLANATION" />
                        </p>}
                        {showHelp == 'spread' && <p>
                            <FormattedMessage id="COMPONENTS.SPREAD_EXPLANATION" />
                        </p>}
                        {showHelp == 'total' && <p>
                            <FormattedMessage id="COMPONENTS.TOTAL_EXPLANATION" />
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