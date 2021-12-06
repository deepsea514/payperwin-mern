import React, { Component } from 'react';
import { Preloader, ThreeDots } from 'react-preloader-icon';
import SVG from "react-inlinesvg";
import { getFrontendInfo, saveFrontendInfo } from '../redux/services';
import Switch from '@material-ui/core/Switch';

export default class ToggleBet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            maintenance: false,
            loading: false,
            isError: false,
            isSuccess: false,
            is_Submitting: false,
        }
    }

    componentDidMount() {
        this.setState({ loading: false });

        getFrontendInfo('maintenance_mode')
            .then(({ data }) => {
                this.setState({
                    loading: false,
                    maintenance: data ? data.value.maintenance : false
                });
            })
            .catch(() => {
                this.setState({ loading: false, maintenance: false });
            })
    }

    handleChange = (event) => {
        const maintenance = event.target.checked;
        const submitValue = { maintenance };
        this.setState({ isSuccess: false, isError: false, is_Submitting: true });
        saveFrontendInfo('maintenance_mode', submitValue)
            .then(() => {
                this.setState({ isSuccess: true, is_Submitting: false, maintenance });
            })
            .catch(() => {
                this.setState({ isError: true, is_Submitting: false, });
            })
    }

    render() {
        const { loading, isError, isSuccess, maintenance, is_Submitting } = this.state;
        return (
            <>
                <h3>Bet Settins</h3>
                {loading && <center>
                    <Preloader use={ThreeDots}
                        size={100}
                        strokeWidth={10}
                        strokeColor="#F0AD4E"
                        duration={800} />
                </center>}
                <div className="form-group">
                    <Switch
                        checked={maintenance}
                        onChange={this.handleChange}
                        value="maintenance"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                        disabled={is_Submitting}
                    />
                </div>

                {isError && (
                    <div
                        className="alert alert-custom alert-light-danger fade show mb-10"
                        role="alert">
                        <div className="alert-icon">
                            <span className="svg-icon svg-icon-3x svg-icon-danger">
                                <SVG src={"/media/svg/icons/Code/Info-circle.svg"} />
                            </span>
                        </div>
                        <div className="alert-text font-weight-bold">
                            Update Failed
                        </div>
                        <div className="alert-close" onClick={() => this.setState({ isError: false })}>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="alert"
                                aria-label="Close">
                                <span aria-hidden="true">
                                    <i className="ki ki-close"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                )}
                {isSuccess && (
                    <div
                        className="alert alert-custom alert-light-success fade show mb-10"
                        role="alert">
                        <div className="alert-icon">
                            <span className="svg-icon svg-icon-3x svg-icon-success">
                                <SVG src={"/media/svg/icons/Code/Info-circle.svg"} />
                            </span>
                        </div>
                        <div className="alert-text font-weight-bold">
                            Successfully Created.
                        </div>
                        <div className="alert-close" onClick={() => this.setState({ isSuccess: false })}>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="alert"
                                aria-label="Close">
                                <span aria-hidden="true">
                                    <i className="ki ki-close"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                )}
            </>
        )
    }
}