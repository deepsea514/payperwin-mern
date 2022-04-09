import React from 'react';
 
class LaxDiv extends React.Component {
    render(){
        return (
            <div className="bg-title lax" data-lax-preset={this.props.dataPreset} >
                {this.props.text}
            </div>
        );
    }
}

LaxDiv.defaultProps = {
    text: 'Speakers',
    dataPreset: 'driftRight'
};
 
export default LaxDiv;