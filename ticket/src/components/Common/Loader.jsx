import React from 'react';
import { Preloader, Puff  } from 'react-preloader-icon';

class Loader extends React.Component {
    render() {
        return (
            <div className='d-flex justify-content-center'>
                <Preloader use={Puff }
                    size={100}
                    strokeWidth={6}
                    strokeColor="#FF2D55"
                    duration={2500} />
            </div>
        );
    }
}

export default Loader;