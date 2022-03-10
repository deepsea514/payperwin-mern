import React from 'react';
import MainBanner from '../Speakers/MainBanner';
import Speakers from '../Speakers/SpeakersTwo';
import Footer from '../Common/Footer';
 
class SpeakersTwo extends React.Component {
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
 
export default SpeakersTwo;