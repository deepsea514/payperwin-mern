import React from 'react'
import MainBanner from '../Speakers/MainBanner';
import Speakers from '../Speakers/SpeakersOne';
import Footer from '../Common/Footer';
 
class SpeakersOne extends React.Component {
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
 
export default SpeakersOne;