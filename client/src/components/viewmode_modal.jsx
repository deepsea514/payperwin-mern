import React from "react";

export default class ViewModeModal extends React.Component {
    render() {
        const { onClose } = this.props;
        return (
            <div className="modal confirmation">
                <div className="background-closer bg-modal" onClick={onClose} />
                <div className="col-in">
                    <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={onClose} />
                    <div className="">
                        <b>View Mode</b>
                        <hr />
                        <p>
                            The <strong>PRO</strong> view offers an advance interface that is familiar to professional betters.
                        </p>
                        <p>
                            The <strong>BASIC</strong> view is recommended for users new to sportsbetting.
                            The interface is simplified and guides you through the betting process.
                        </p>
                        <hr />

                        <div className="d-flex flex-column">
                            <a href="#" onClick={onClose} className="view-modal-link pro py-3"><b>Pro View</b></a>
                            <a href="#" onClick={onClose} className="view-modal-link pt-3"><b>Basic View</b></a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}