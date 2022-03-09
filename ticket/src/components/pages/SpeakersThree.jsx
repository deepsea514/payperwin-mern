import React from 'react';
import MainBanner from '../Speakers/MainBanner';
import Speakers from '../Speakers/SpeakersThree';
import Footer from '../Common/Footer';
 
class SpeakersThree extends React.Component {
    render(){
        return (
            <React.Fragment>
                <MainBanner />
                <Speakers />
                <Footer />
            </React.Fragment>
        );
    }
}
 
export default SpeakersThree;