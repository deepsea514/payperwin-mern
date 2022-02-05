import React, { Component } from 'react';
import { Preloader, ThreeDots } from 'react-preloader-icon';
import SVG from "react-inlinesvg";
import { getFrontendInfo, saveFrontendInfo } from '../redux/services';
import { Switch, FormGroup, FormControlLabel } from '@material-ui/core';

export default class ToggleBet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            single: true,
            teaser: true,
            parlay: true,
            live: true,
            loading: false,
            isError: false,
            isSuccess: false,
            is_Submitting: false,
        }
    }

    componentDidMount() {
        this.setState({ loading: false });

        getFrontendInfo('bet_settings')
            .then(({ data }) => {
                this.setState({
                    loading: false,
                    single: data ? Boolean(data.value.single) : true,
                    teaser: data ? Boolean(data.value.teaser) : true,
                    parlay: data ? Boolean(data.value.parlay) : true,
                    live: data ? Boolean(data.value.live) : true,
                });
            })
            .catch(() => {
                this.setState({ loading: false, single: false });
            })
    }

    handleChange = async (event) => {
        const { single, teaser, parlay, live } = this.state;
        const value = event.target.checked;
        const key = event.target.name;
        this.setState({ isSuccess: false, isError: false, is_Submitting: true });
        saveFrontendInfo('bet_settings', { ...{ single, teaser, parlay, live }, [key]: value })
            .then(() => {
                this.setState({ isSuccess: true, is_Submitting: false, [key]: value });
            })
            .catch(() => {
                this.setState({ isError: true, is_Submitting: false, });
            })
    }

    render() {
        const { loading, isError, isSuccess, single, teaser, parlay, live, is_Submitting } = this.state;
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
                <FormGroup row>
                    <FormControlLabel control={<Switch
                        checked={single}
                        onChange={this.handleChange}
                        value="single"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                        disabled={is_Submitting}
                        name="single"
                    />} label="Single Bets" />
                    <FormControlLabel control={<Switch
                        checked={parlay}
                        onChange={this.handleChange}
                        value="parlay"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                        disabled={is_Submitting}
                        name="parlay"
                    />} label="Parlay Bets" />
                    <FormControlLabel control={<Switch
                        checked={teaser}
                        onChange={this.handleChange}
                        value="teaser"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                        disabled={is_Submitting}
                        name="teaser"
                    />} label="Teaser Bets" />
                    <FormControlLabel control={<Switch
                        checked={live}
                        onChange={this.handleChange}
                        value="live"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                        disabled={is_Submitting}
                        name="live"
                    />} label="Live Bets" />
                </FormGroup>

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