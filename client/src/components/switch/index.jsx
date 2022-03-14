import React, { Component } from 'react';
import { connect } from "react-redux";
import * as frontend from "../../redux/reducer";
import ReactSwitch from './switch';

class Switch extends Component {
    render() {
        const { pro_mode, setProMode, takeAction } = this.props;
        return (
            <ReactSwitch checked={pro_mode}
                onChange={(checked) => { setProMode(checked); takeAction && takeAction() }}
                handleDiameter={20}
                offColor="#FFF"
                onColor="#FFF"
                offHandleColor="#ED254E"
                onHandleColor="#ED254E"
                height={20}
                width={100}
                borderRadius={10}
                activeBoxShadow="none"
                uncheckedIcon={
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        fontSize: 12,
                        color: "#ED254E",
                        paddingRight: 1,
                        paddingLeft: 1
                    }}>Pro</div>
                }
                checkedIcon={
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        fontSize: 12,
                        color: "#ED254E",
                        paddingRight: 1,
                        paddingLeft: 1
                    }}>Basic</div>
                }
                uncheckedHandleIcon={
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        fontSize: 12,
                        color: "#fff",
                        paddingRight: 1,
                        paddingLeft: 1
                    }}>Basic</div>
                }
                checkedHandleIcon={
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        fontSize: 12,
                        color: "#fff",
                        paddingRight: 1,
                        paddingLeft: 1
                    }}>Pro</div>
                }
                className="react-switch-viewmode"
                id="small-radius-switch"
            />
        );
    }
}

const mapStateToProps = (state) => ({
    pro_mode: state.frontend.pro_mode,
});

export default connect(mapStateToProps, frontend.actions)(Switch)