import React from "react";
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";

class ViewModeModal extends React.Component {
    setPromode = (pro_mode) => {
        const { onClose, setProMode } = this.props;
        setProMode(pro_mode);
        onClose();
    }

    render() {
        const { onClose, pro_mode } = this.props;
        return (
            <div className="modal confirmation">
                <div className="background-closer bg-modal" onClick={onClose} />
                <div className="col-in">
                    <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={onClose} />
                    <div className="">
                        <b>View Mode</b>
                        <hr />
                        <p>
                            The <strong>PRO</strong> view offers an advance interface that is familiar to experienced bettors.
                        </p>
                        <p>
                            The <strong>BASIC</strong> view is recommended for users new to sportsbetting.
                            The interface is simplified and guides you through the betting process.
                        </p>
                        <hr />

                        <div className="d-flex flex-column">
                            <a href="#" onClick={() => this.setPromode(true)} className={`view-modal-link py-3 ${pro_mode ? '' : 'pro'}`}><b>Pro View</b></a>
                            <a href="#" onClick={() => this.setPromode(false)} className={`view-modal-link pt-3 ${pro_mode ? 'pro' : ''}`}><b>Basic View</b></a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, { setProMode: frontend.actions.setProMode })(ViewModeModal)