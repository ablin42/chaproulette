import React from "react";
import Image from "next/image";

export default class Wheel extends React.Component<
  { items: any; onSelectItem?: any },
  { selectedItem: null | number; isSpinning: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedItem: null,
      isSpinning: false,
    };
    this.selectItem = this.selectItem.bind(this);
  }

  selectItem() {
    if (this.state.isSpinning === true) return;
    if (this.state.selectedItem === null) {
      const selectedItem = Math.floor(Math.random() * this.props.items.length);
      if (this.props.onSelectItem) {
        this.props.onSelectItem(selectedItem);
      }
      this.setState({ selectedItem, isSpinning: true });
      setTimeout(
        () => this.setState({ selectedItem, isSpinning: false }),
        4000
      );
    } else {
      this.setState({ selectedItem: null });
      setTimeout(this.selectItem, 500);
    }
  }

  render() {
    const { selectedItem } = this.state;
    const { items } = this.props;

    const wheelVars = {
      "--nb-item": items.length,
      "--selected-item": selectedItem,
    } as React.CSSProperties;
    const spinning = selectedItem !== null ? "spinning" : "";

    return (
      <div className="wheel-container">
        <div
          className={`wheel ${spinning}`}
          style={wheelVars}
          onClick={this.selectItem}
        >
          {items.map((item: any, index: number) => (
            <div
              className="wheel-item"
              key={index}
              style={{ "--item-nb": index } as React.CSSProperties}
            >
              <div className="wheel-img">
                <Image
                  width={80}
                  height={80}
                  alt={item.role}
                  src={item.roleImg}
                />
              </div>
              <div className="wheel-img">
                <Image
                  width={80}
                  height={80}
                  alt={item.championName}
                  src={item.championImg}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
