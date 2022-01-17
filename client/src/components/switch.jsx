import React from "react";
import "./switch.css";

const Switch = ({ isOn, handleToggle }) => {
    return (
        <label className={`react-switch ${isOn ? 'on' : 'off'}`}>
            <input
                checked={isOn}
                onChange={handleToggle}
                className="react-switch-checkbox"
                type="checkbox"
            />
            <div className="react-switch-button" />
            <div className="react-switch-labels">
                <span>Basic</span>
                <span>Pro</span>
            </div>
        </label>
    );
};

export default Switch;
