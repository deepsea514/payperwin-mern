import React from "react";
import Switch from './switch';

class ViewModeModal extends React.Component {
    render() {
        const { onClose } = this.props;
        return (
            <div className="modal confirmation">
                <div className="background-closer bg-modal" onClick={onClose} />
                <div className="col-in">
                    <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={onClose} />
                    <div className="">
                        <b>Select Mode</b>
                        <hr />
                        <div className="d-flex justify-content-center mb-4">
                            <img src="/images/pro-basic.png" />
                        </div>
                        <p>
                            The <strong>PRO</strong> view offers an advance interface that is familiar to experienced bettors.
                        </p>
                        <p>
                            The <strong>BASIC</strong> view is recommended for users new to sportsbetting.
                            The interface is simplified and guides you through the betting process.
                        </p>
                        <hr />

                        <div className="d-flex justify-content-center">
                            <Switch />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ViewModeModal