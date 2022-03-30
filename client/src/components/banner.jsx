import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Bet from "./bet";
import { connect } from "react-redux";
import * as frontend from "../redux/reducer";
import BetParlay from './betparlay';
import BetTeaser from './betteaser';
import { FormattedMessage, injectIntl } from 'react-intl';
import { placeBets, placeParlayBets, placeTeaserBets } from '../redux/services';
import BetBasic from './bet_basic';

class Banner extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this._Mounted = false;
    }

    componentDidMount() {
        this._Mounted = true;
    }

    componentWillUnmount() {
        this._Mounted = false;
    }


    render() {
        const {
        } = this.state;
        const {
        } = this.props;

        return (
            <div className='mt-3'>
                <a href="#" target="_blank">
                    <img src="/images/PPW Meta.png" />
                </a>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
});


export default connect(mapStateToProps, frontend.actions)(injectIntl(Banner));