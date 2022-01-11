import React from "react";
import { FormattedMessage } from 'react-intl';

export default class SBModal extends React.Component {
    render() {
        const { sportsbookInfo, onClose, onAccept } = this.props;
        return (
            <div className="modal confirmation">
                <div className="background-closer bg-modal" onClick={onClose} />
                <div className="col-in">
                    <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={onClose} />
                    <div>
                        <b><FormattedMessage id="COMPONENTS.HIGHSTAKER.TITLE" /></b>
                        <hr />
                        <p>
                            <FormattedMessage id="COMPONENTS.HIGHSTAKER.CONTENT" />
                        </p>
                        <b>{sportsbookInfo.name}: {sportsbookInfo.pickName}@{sportsbookInfo.originOdds[sportsbookInfo.pick]}</b>
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