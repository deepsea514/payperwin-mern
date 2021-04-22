import React, { PureComponent } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { setTitle } from '../libs/documentTitleBuilder'

class Verification extends PureComponent {
    componentDidMount() {
        setTitle({ pageTitle: 'Verification' });
    }

    handleFileUpload = (e) => {
        console.log(e.target.name, e.target.files[0].name)
    }

    render() {
        return (
            <div className="col-in">
                <h3>Verification</h3>
                <div className="main-cnt">
                    <p className="text-black">
                        Please follow the instruction and upload copies of the documents we support.
                        The document must be smaller than 5MB.
                        Verifying your account can take up to 72 hours after submission.
                    </p>
                    <div className="bg-color-box pad10">
                        <h4>DOCUMENT STATUS</h4>
                        <br />
                        <p className="verification-items" onClick={() => this.refs.address.click()}>
                            Address verification <span className="badge badge-primary">REQUIRED</span>
                        </p>
                        <input ref="address" name="address" onChange={this.handleFileUpload} type="file" style={{ display: "none" }} />
                        <p className="verification-items" onClick={() => this.refs.identification.click()}>
                            Personal identification verification <span className="badge badge-primary">REQUIRED</span>
                        </p>
                        <input ref="identification" name="identification" onChange={this.handleFileUpload} type="file" style={{ display: "none" }} />
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Verification);