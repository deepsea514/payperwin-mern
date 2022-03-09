import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Used to cancel events.
var preventDefault = e => e.preventDefault();

export default class CustomPagination extends Component {
    static defaultProps = {
        showPages: 5,
    };

    static propTypes = {
        onChangePage: PropTypes.func.isRequired,
        totalPages: PropTypes.number.isRequired,
        currentPage: PropTypes.number.isRequired,
        showPages: PropTypes.number,
    };

    shouldComponentUpdate(nextProps) {
        var props = this.props;

        return (
            props.totalPages !== nextProps.totalPages ||
            props.currentPage !== nextProps.currentPage ||
            props.showPages !== nextProps.showPages
        );
    }

    onChangePage(pageNumber, event) {
        event.preventDefault();
        this.props.onChangePage(pageNumber);
    }

    render() {
        var { totalPages, showPages, currentPage } = this.props;

        if (totalPages === 0) {
            return null;
        }

        var diff = Math.floor(showPages / 2),
            start = Math.max(currentPage - diff, 0),
            end = Math.min(start + showPages, totalPages);

        if (totalPages >= showPages && end >= totalPages) {
            start = totalPages - showPages;
        }

        var buttons = [],
            btnEvent,
            isCurrent;
        for (var i = start; i < end; i++) {
            isCurrent = currentPage === i;
            // If the button is for the current page then disable the event.
            if (isCurrent) {
                btnEvent = preventDefault;
            } else {
                btnEvent = this.onChangePage.bind(this, i);
            }
            buttons.push(
                <li className="page-item" key={i}>
                    <a href='#' className={"page-link" + (isCurrent ? " active" : "")} onClick={btnEvent}>
                        {i + 1}
                    </a>
                </li>
            );
        }

        // First and Prev button handlers and class.
        var firstHandler = preventDefault;
        var prevHandler = preventDefault;
        var isNotFirst = currentPage > 0;
        if (isNotFirst) {
            firstHandler = this.onChangePage.bind(this, 0);
            prevHandler = this.onChangePage.bind(this, currentPage - 1);
        }

        // Next and Last button handlers and class.
        var nextHandler = preventDefault;
        var lastHandler = preventDefault;
        var isNotLast = currentPage < totalPages - 1;
        if (isNotLast) {
            nextHandler = this.onChangePage.bind(this, currentPage + 1);
            lastHandler = this.onChangePage.bind(this, totalPages - 1);
        }

        buttons = [
            <li className="page-item" key="first">
                <a href='#' className={"page-link" + (!isNotFirst ? ' disabled' : '')}
                    onClick={firstHandler}>
                    <i className="icofont-curved-double-left"></i>
                </a>
            </li>,
            <li className="page-item" key="prev">
                <a href='#' className={"page-link" + (!isNotFirst ? ' disabled' : '')}
                    onClick={prevHandler}>
                    <i className="icofont-curved-left"></i>
                </a>
            </li>,
        ].concat(buttons);

        buttons = buttons.concat([
            <li className="page-item" key="next">
                <a href='#' className={"page-link" + (!isNotLast ? ' disabled' : '')}
                    onClick={nextHandler}>
                    <i className="icofont-curved-right"></i>
                </a>
            </li>,
            <li className="page-item" key="last">
                <a href='#' className={"page-link" + (!isNotLast ? ' disabled' : '')}
                    onClick={lastHandler}>
                    <i className="icofont-curved-double-right"></i>
                </a>
            </li>,
        ]);

        return (
            <div className='row'>
                <div className="col-lg-12 col-md-12">
                    <div className="pagination-area">
                        <nav aria-label="Page navigation">
                            <ul className="pagination justify-content-center">
                                {buttons}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        );
    }
}
