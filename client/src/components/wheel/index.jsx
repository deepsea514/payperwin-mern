import React from "react";
import rouletteSelection from "../../libs/rouletteSelection";
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

        return (
            <div className="wheel-container">
                <div className={`wheel ${spinning}`}
                    style={wheelVars}
                    onClick={this.selectItem}>
                    {items.map((item, index) => (
                        <div className="wheel-item"
                            key={index}
                            style={{ "--item-nb": index }}>
                            {item.label}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
