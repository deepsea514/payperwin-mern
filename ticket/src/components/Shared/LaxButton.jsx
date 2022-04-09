import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
 
class LaxButton extends React.Component {

    render(){
        return (
            <Link to="#" className="btn btn-primary lax" data-lax-preset="driftLeft">
                {this.props.buttonText}
            </Link>
        );
    }
}

LaxButton.defaultProps = {
    buttonText: 'Explore More About'
};
 
export default LaxButton;