import React from "react";
import * as frontend from "../redux/reducer";
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SwipeableViews from 'react-swipeable-views';

const useStyles = {
    root: {
        flexGrow: 1,
        padding: '0 !important',
    },
    container: {
        textAlign: 'center',
        paddingTop: '20px',
    },
    img: {
        height: 'auto',
        display: 'block',
        overflow: 'hidden',
        width: '100%',
    },
    button: {
        margin: '0 10px'
    },
};

const tourSteps = [
    {
        title: 'Open Bets',
        description: 'On this page you will find all open bets for Peer-to-Peer and Sportsbook. Here you can check the status of all your bets.',
        imgPath: '/images/slides/slide1.jpg',
    },
    {
        title: 'Bet Forward',
        description: 'Peer-to-Peer bets offer better odds. You will have to wait for a peer to bet against you, or you have the option to forward your bet to the Sportsbook for an instant accepted bet. The odds will be different here. Sportsbook odds will greater than the Peer-to-Peer odds.',
        imgPath: '/images/slides/slide2.jpg',
    },
    {
        title: 'Bet Your Friends',
        description: 'Share your bet with your friends to have them bet with or against you.',
        imgPath: '/images/slides/slide3.jpg',
    },
];


class TourModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
        }
    }

    handleNext = () => {
        const { activeStep } = this.state;
        const { hideTourAction } = this.props;
        if (activeStep < tourSteps.length - 1) {
            this.setState({ activeStep: activeStep + 1 });
        } else {
            hideTourAction();
        }
    };

    handleBack = () => {
        const { activeStep } = this.state;
        this.setState({ activeStep: activeStep - 1 });
    };

    render() {
        const { hideTourAction, classes } = this.props;
        const { activeStep } = this.state;
        const maxSteps = tourSteps.length;

        return (
            <div className="modal confirmation">
                <div className="background-closer bg-modal" />
                <div className={`col-in ${classes.root}`}>
                    <SwipeableViews
                        axis={'x'}
                        index={activeStep}
                        enableMouseEvents
                    >
                        {tourSteps.map((step, index) => (
                            <div key={index} className={classes.container}>
                                <h3>{step.title}</h3>
                                <p className="px-3 pt-2">{step.description}</p>
                                {Math.abs(activeStep - index) <= 2 ? (
                                    <img className={classes.img} src={step.imgPath} alt={step.label} />
                                ) : null}
                            </div>
                        ))}
                    </SwipeableViews>
                    <div className="text-right mr-3 my-3">
                        <Button
                            disabled={activeStep === 0}
                            onClick={this.handleBack}
                            className={classes.button}
                        >
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleNext}
                            className={classes.button}
                        >
                            {activeStep === maxSteps - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(null, frontend.actions)(withStyles(useStyles)(TourModal));
