import React from 'react';
import MainBanner from '../components/Home/MainBanner';
import TopPlaces from '../components/Home/TopPlaces';
import GoTop from '../components/Shared/GoTop';
import Popular from '../components/Home/Popular';
import Footer from "../components/Common/Footer";
import FunFact from '../components/Common/FunFact';

class Home extends React.Component {
    render() {
        return (
            <React.Fragment>
                <MainBanner />
                <Popular />
                <TopPlaces />
                <FunFact />
                <Footer />
                <GoTop scrollStepInPx="50" delayInMs="16.66" />
            </React.Fragment>
        );
    }
}

export default Home;