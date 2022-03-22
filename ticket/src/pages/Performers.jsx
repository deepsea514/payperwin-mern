import React from 'react';
import Footer from "../components/Common/Footer";
import MainBanner from '../components/Performers/MainBanner';

class Performers extends React.Component {
    render() {
        return (
            <React.Fragment>
                <MainBanner />

                <Footer />
            </React.Fragment>
        );
    }
}

export default Performers;