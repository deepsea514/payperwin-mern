import React, { PureComponent } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { setTitle } from '../libs/documentTitleBuilder';
import ReactApexChart from "react-apexcharts";
import { Preloader, ThreeDots } from 'react-preloader-icon';
import { Tabs, Tab, } from 'react-bootstrap';
import dateformat from "dateformat";
import SVG from "react-inlinesvg";

const config = require('../../../config.json');
const serverUrl = config.serverHostToClientHost[process.env.NODE_ENV == 'production' ? 'production' : 'development'].appUrl;

export default class Loyalty extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            loading: false,
            data: null
        };
    }

    componentDidMount() {
        const title = 'Loyalty Program';
        setTitle({ pageTitle: title });
    }

    componentDidUpdate(prevProps) {
        const { user } = this.props;
        const { user: prevUser } = prevProps;

        if (!prevUser && user) {
            this.setState({ error: null });
        }
    }

    getLoyaltyPoints = () => {
        this.setState({ loading: true });
        this.setState({ loading: false, data: { loyalty: 1000 } });
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    render() {
        const { loading, error, data } = this.state;

        return (
            <div className="col-in px-3">
                <h3>Loyalty Program</h3>
                {loading && <center><Preloader use={ThreeDots}
                    size={100}
                    strokeWidth={10}
                    strokeColor="#F0AD4E"
                    duration={800} />
                </center>}
                {error && <p>Error...</p>}
                {data && <div className="row">
                    <div className="col-md-5">

                    </div>
                    <div className="col-md-7"></div>
                </div>}
            </div>
        );
    }
}
