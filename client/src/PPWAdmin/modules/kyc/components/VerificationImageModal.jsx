import React from "react";
import { Button, Modal } from "react-bootstrap";
import { Preloader, ThreeDots } from 'react-preloader-icon';

export default class VerificationImageModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { show, onHide, address, identification } = this.props;
        return (
            <Modal show={show} onHide={onHide} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Verification Images</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Address</h4>
                    {address.loading && <Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} />}
                    {!address.loading && !address.data &&
                        <p>
                            Can't load image.
                        </p>}
                    {!address.loading && address.data &&
                        <img src={address.data} />}

                    <hr />

                    <h4>Identification</h4>
                    {identification.loading && <Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} />}
                    {!identification.loading && !identification.data &&
                        <p>
                            Can't load image.
                        </p>}
                    {!identification.loading && identification.data &&
                        <img src={identification.data} />}

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }

}