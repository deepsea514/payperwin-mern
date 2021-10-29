import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

class Favorites extends Component {
    render() {
        const { user } = this.props;
        return (
            <div className="favorites">
                Click the <i className="fas fa-star" /> by your favourite league or team to add.
            </div>
        );
    }
}

export default Favorites;