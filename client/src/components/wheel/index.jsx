import React from "react";
import rouletteSelection from "../../libs/rouletteSelection";
import Confetti from 'react-dom-confetti';
import "./index.css";

export default class Wheel extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedItem: null };
    }

    selectItem = () => {
        const { onClose, showLoginModalAction, user, items, onSelectItem } = this.props;
        if (!user) {
            onClose();
            showLoginModalAction();
        }
        const { selectedItem } = this.state;
        if (selectedItem === null) {
            const selectedItem = rouletteSelection(items);
            if (onSelectItem) {
                setTimeout(() => onSelectItem(selectedItem), 6000);
            }
            this.setState({ selectedItem });
        }
    }

    render() {
        const { selectedItem } = this.state;
        const { items } = this.props;

        const wheelVars = {
            "--nb-item": items.length,
            "--selected-item": selectedItem
        };
        const spinning = selectedItem !== null ? "spinning" : "";
        const config = {
            angle: 90,
            spread: 360,
            startVelocity: 40,
            elementCount: 70,
            dragFriction: 0.12,
            duration: 3000,
            stagger: 3,
            width: "10px",
            height: "10px",
            perspective: "500px",
            colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
        };

        return (
            <>
                <div className="d-flex justify-content-center" style={{ height: 0 }}>
                    <Confetti active={selectedItem != null} config={config} />
                </div>
                <div className="wheel-container" onClick={this.selectItem}>
                    <div className={`wheel ${spinning}`}
                        style={wheelVars}>
                        {items.map((item, index) => (
                            <div className="wheel-item"
                                key={index}
                                style={{ "--item-nb": index }}>
                                <span style={{
                                    backgroundImage: `linear-gradient(180deg, ${item.textColor}, ${item.textColor2})`,
                                    textShadow: `0px 0px 2px ${item.textColor}`
                                }}
                                    className="wheel-item-text">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    }
}
