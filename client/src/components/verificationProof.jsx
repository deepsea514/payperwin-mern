import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class VerificationProof extends Component {
    render() {
        return (
            <>
                <div className="verification-proof-container shadow">
                    <h6>Proof of Identify</h6>
                    <p>Please upload one of the following documents, ensuring it is valid.</p>
                    <div className="verification-proof-list">
                        <ul>
                            <li>Passport</li>
                            <li>Driving License</li>
                            <li>National ID</li>
                        </ul>
                    </div>
                </div>

                <div className="verification-proof-container shadow mt-3">
                    <h6>Proof of Address</h6>
                    <p>Please upload one of the following documents, ensuring it is valid and <strong>no older than 3 months</strong>.</p>
                    <div className="verification-proof-list">
                        <ul>
                            <li>Bank Statement</li>
                            <li>Utility Bill</li>
                            <li>House Phone Bill</li>
                            <li>Government Documentation</li>
                        </ul>
                    </div>
                </div>
            </>
        );
    }
}
