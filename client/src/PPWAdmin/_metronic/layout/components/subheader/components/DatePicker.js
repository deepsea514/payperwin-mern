/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { forwardRef } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import dateformat from "dateformat";
import * as dashboard from "../../../../../modules/dashboard/redux/reducers";
import { connect } from "react-redux";

class DatePickerToggle extends React.Component {
    getDateRange = () => {
        const { selectedDate } = this.props;
        let year, month, day, rangeText, title;
        const nowDate = new Date();
        year = nowDate.getFullYear();
        month = nowDate.getMonth();
        day = nowDate.getDate();

        switch (selectedDate) {
            case "today":
                rangeText = dateformat(nowDate, "mmm d, yyyy");
                title = "Today";
                break;
            case "yesterday":
                rangeText = dateformat(new Date(year, month, day - 1), "mmm d, yyyy");
                title = "Yesterday";
                break;
            case "last7days":
                rangeText = dateformat(new Date(year, month, day - 6), "mmm d, yyyy - ");
                rangeText += dateformat(nowDate, "mmm d, yyyy");
                title = "Last 7 Days";
                break;
            case "last30days":
                rangeText = dateformat(new Date(year, month, day - 30), "mmm d, yyyy - ");
                rangeText += dateformat(nowDate, "mmm d, yyyy");
                title = "Last 30 Days";
                break;
            case "thismonth":
                rangeText = dateformat(new Date(year, month, 1), "mmm d, yyyy - ");
                rangeText += dateformat(nowDate, "mmm d, yyyy");
                title = "This Month";
                break;
            case "lastmonth":
                rangeText = dateformat(new Date(year, month - 1, 1), "mmm d, yyyy - ");
                rangeText += dateformat(new Date(year, month, 0), "mmm d, yyyy");
                title = "Last Month";
                break;
            case "thisyear":
                rangeText = dateformat(new Date(year, 0, 1), "mmm d, yyyy - ");
                rangeText += dateformat(nowDate, "mmm d, yyyy");
                title = "This Year";
                break;
            default:
                break;
        }
        return {
            rangeText,
            title
        }
    }

    render() {
        const { myref, onClick, selectedDate } = this.props;
        return (
            <a
                ref={myref}
                className="btn btn-light btn-sm font-weight-bold"
                data-toggle="tooltip"
                data-placement="left"
                onClick={e => {
                    e.preventDefault();
                    onClick(e);
                }}
            >
                <span className="text-muted font-weight-bold mr-2">{this.getDateRange().title}</span>
                <span className="text-primary font-weight-bold">{this.getDateRange().rangeText}</span>
            </a>
        )
    }
}

const mapStateToProps = (state) => ({
    selectedDate: state.dashboard.selectedDate
})

const DatePickerToggleWithState = connect(mapStateToProps)(DatePickerToggle);

const QuickActionsDropdownToggle = forwardRef((props, ref) => {
    return (
        <DatePickerToggleWithState {...props} myref={ref} />
    );
});

class DatePicker extends React.Component {
    render() {
        const { selectedDate, changeDateRange } = this.props;
        return (
            <>
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Select Date Range</Tooltip>}
                >
                    <Dropdown className="dropdown-inline" drop="down" alignRight>
                        <Dropdown.Toggle
                            as={QuickActionsDropdownToggle}
                        />
                        <Dropdown.Menu className="dropdown-menu p-0 m-0 dropdown-menu-sm dropdown-menu-right">
                            <ul className="date-range">
                                <li onClick={() => changeDateRange('today')} className={selectedDate == "today" ? "active" : ""}>Today</li>
                                <li onClick={() => changeDateRange('yesterday')} className={selectedDate == "yesterday" ? "active" : ""}>Yesterday</li>
                                <li onClick={() => changeDateRange('last7days')} className={selectedDate == "last7days" ? "active" : ""}>Last 7 Days</li>
                                <li onClick={() => changeDateRange('last30days')} className={selectedDate == "last30days" ? "active" : ""}>Last 30 Days</li>
                                <li onClick={() => changeDateRange('thismonth')} className={selectedDate == "thismonth" ? "active" : ""}>This Month</li>
                                <li onClick={() => changeDateRange('lastmonth')} className={selectedDate == "lastmonth" ? "active" : ""}>Last Month</li>
                                <li onClick={() => changeDateRange('thisyear')} className={selectedDate == "thisyear" ? "active" : ""}>This Year</li>
                            </ul>
                        </Dropdown.Menu>
                    </Dropdown>
                </OverlayTrigger>
            </>
        );
    }
}

export default connect(mapStateToProps, dashboard.actions)(DatePicker);