import React from "react";
import Switch from './switch';
import { connect } from 'react-redux';

class ViewModeModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { actionTaken: false };
    }

    componentDidMount() {
        setTimeout(this.closeModal, 5000);
    }

    closeModal = () => {
        const { onClose, user } = this.props;
        const { actionTaken } = this.state;
        if (!user && !actionTaken) {
            onClose()
        }
    }

    render() {
        const { onClose } = this.props;
        return (
            <div className="modal confirmation">
                <div className="background-closer bg-modal" onClick={onClose} />
                <div className="col-in">
                    <i className="fal fa-times" style={{ cursor: 'pointer' }} onClick={onClose} />
                    <div className="">
                        <b>Choose your view</b>
                        <hr />
                        <div className="d-flex justify-content-center mb-4">
                            <img src="/images/pro-basic.gif" />
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
                            <Switch takeAction={() => this.setState({ actionTaken: true })} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.frontend.user,
});

export default connect(mapStateToProps, null)(ViewModeModal);