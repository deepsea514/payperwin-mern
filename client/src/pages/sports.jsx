import React, { PureComponent } from 'react';
import { setMeta } from '../libs/documentTitleBuilder'
import SportsList from '../components/sportsList';
import DocumentMeta from 'react-document-meta';

export default class Sports extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            metaData: null,
        };
    }

    componentDidMount() {
        const title = 'Sports List';
        setMeta(title, (metaData) => {
            this.setState({ metaData: metaData });
        })
    }

    render() {
        const { metaData } = this.state;
        return (
            <>
                {metaData && <DocumentMeta {...metaData} />}
                <SportsList />
            </>
        );
    }
}