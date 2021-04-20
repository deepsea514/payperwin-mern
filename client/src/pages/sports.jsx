import React, { PureComponent } from 'react';
import { setTitle } from '../libs/documentTitleBuilder'
import SportsList from '../components/sportsList';

export default class Sports extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        setTitle({ pageTitle: 'Sports' });
    }

    render() {
        return (
            <SportsList />
        );
    }
}