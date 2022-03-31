import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Bet from "./bet";
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import BetParlay from './betparlay';
import BetTeaser from './betteaser';
import { FormattedMessage, injectIntl } from 'react-intl';
import { getAdminBanner } from '../redux/services';
import BetBasic from './bet_basic';
import _env from '../env.json';
const serverUrl = _env.appUrl;

class Banner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            path: '',
            link_url: '',
            show: false,
        };
        this._Mounted = false;
    }

    componentDidMount() {
        this._Mounted = true;
        getAdminBanner('banner')
            .then(({ data }) => {
                if (data)
                    this.setState({
                        path: data.value.path,
                        link_url: data.value.link_url,
                        show: data.value.show,
                    });
            })
            .catch(() => {
                this.setState({ loading: false, initialValues: null });
            })
    }

    componentWillUnmount() {
        this._Mounted = false;
    }


    render() {
        const { path, link_url, show, } = this.state;

        return (
            show == 'true' && <div className='mt-3'>
                <a href={serverUrl+"/frontend_banner_clicked"} target="_blank">
                    <img src={`${serverUrl}/static/${path}`} />
                </a>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
});


export default connect(mapStateToProps, frontend.actions)(injectIntl(Banner));