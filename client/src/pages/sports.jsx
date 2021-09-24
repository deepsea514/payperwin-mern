import React, { Component } from 'react';
import { setTitle } from '../libs/documentTitleBuilder'
import SportsList from '../components/sportsList';


export default class Sports extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        const title = 'Sports List';
        setTitle({ pageTitle: title })
    }

    render() {
        return (
            <>
                <SportsList />
            </>
        );
    }
}