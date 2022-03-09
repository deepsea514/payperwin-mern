import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import lax from 'lax.js';
 
class LaxButton extends React.Component {

    componentDidMount() {
        this.el = ReactDOM.findDOMNode(this)
        lax.addElement(this.el)
    }
    
    componentWillUnmount() {
        lax.removeElement(this.el)
    }

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