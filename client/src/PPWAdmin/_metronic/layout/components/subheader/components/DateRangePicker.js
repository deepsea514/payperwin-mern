/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import dateformat from 'dateformat';
import { connect } from 'react-redux';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import * as dashboard from '../../../../../modules/dashboard/redux/reducers';

const mapStateToProps = state => ({
  daterange: state.dashboard.daterange
});

class DateRPicker extends React.Component {

  render() {
    const { daterange, changeDateRange } = this.props;
    return (
      <>
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Select Date Range</Tooltip>}
        >
          <DateRangePicker
           maxDate={new Date().toISOString()} 
          initialSettings={daterange}
            onApply={(event, picker) => {
                changeDateRange({
                        startDate: picker.startDate._d,
                        endDate: picker.endDate._d
                })
            }}
            initialSettings={{ daterange }}
          >
            <input className="form-control" />
          </DateRangePicker>

        </OverlayTrigger>
      </>
    );
  }
}

export default connect(mapStateToProps, dashboard.actions)(DateRPicker);
