import React from "react";
import * as frontend from "../redux/reducer";
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SwipeableViews from 'react-swipeable-views';
import { FormattedMessage, injectIntl } from 'react-intl';

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

class TourModal extends React.Component {
    constructor(props) {
        super(props);
        const { intl } = props;
        this.state = {
            activeStep: 0,
            tourSteps: [
                {
                    title: intl.formatMessage({ id: "COMPONENTS.TOUR.TITLE_1" }),
                    description: intl.formatMessage({ id: "COMPONENTS.TOUR.DESCRIPTION_1" }),
                    imgPath: '/images/slides/slide1.jpg',
                },
                {
                    title: intl.formatMessage({ id: "COMPONENTS.TOUR.TITLE_2" }),
                    description: intl.formatMessage({ id: "COMPONENTS.TOUR.DESCRIPTION_2" }),
                    imgPath: '/images/slides/slide2.jpg',
                },
                {
                    title: intl.formatMessage({ id: "COMPONENTS.TOUR.TITLE_3" }),
                    description: intl.formatMessage({ id: "COMPONENTS.TOUR.DESCRIPTION_3" }),
                    imgPath: '/images/slides/slide3.jpg',
                },
            ],
        }
    }

    handleNext = () => {
        const { activeStep, tourSteps } = this.state;
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
        const { activeStep, tourSteps } = this.state;
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

export default connect(null, frontend.actions)(withStyles(useStyles)(injectIntl(TourModal)));
