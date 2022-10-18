import * as React from "react";

interface Props {
  updateInputValues: Function;
  label: string;
  id: string;
}

class InputComponent extends React.Component<Props> {
  handleInputChange = (e: HTMLInputElement) => {
    this.props.updateInputValues(this.props.id, e.value);
  };
  render() {
    return (
      <div className="flex justify-center">
        <div className="mb-3 xl:w-96">
          <label className="form-label inline-block mb-2 text-gray-700">
            {this.props.label}
          </label>
          <input
            type="text"
            className="  form-control
    block
    w-full
    px-3
    py-1.5
    text-base
    font-normal
    text-gray-700
    bg-white bg-clip-padding
    border border-solid border-gray-300
    rounded
    transition
    ease-in-out
    m-0
    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            id={this.props.id}
            onChange={(e) => {
              this.handleInputChange(e.target);
            }}
            required
          />
        </div>
      </div>
    );
  }
}

export default InputComponent;
