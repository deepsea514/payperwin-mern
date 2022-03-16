import React from 'react';
import lax from 'lax.js';
import MainBanner from '../components/Home/MainBanner';
import TopPlaces from '../components/Home/TopPlaces';
import GoTop from '../components/Shared/GoTop';
import Popular from '../components/Home/Popular';
import Footer from "../components/Common/Footer";

class Home extends React.Component {
    constructor(props) {
        super(props)
        lax.setup()

        document.addEventListener('scroll', function (x) {
            lax.update(window.scrollY)
        }, false)

        lax.update(window.scrollY)
    }
    render() {
        return (
            <React.Fragment>
                <MainBanner />
                <Popular />
                <TopPlaces />
                <Footer />
                <GoTop scrollStepInPx="50" delayInMs="16.66" />
            </React.Fragment>
        );
    }
}

export default Home;