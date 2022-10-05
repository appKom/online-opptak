import * as React from "react";

interface Props {
  updateInputValues: Function;
  label: string;
  id: string;
  values: any[][];
  biggerlabel?: boolean;
}

class InputComponent extends React.Component<Props> {
  handleInputChange = (e: React.BaseSyntheticEvent) => {
    this.props.updateInputValues(this.props.id, e.target.value);
  };
  render() {
    return (
      <div className="flex justify-center" key={this.props.id}>
        <div className="mb-3 xl:w-96">
          <label
            className={
              this.props.biggerlabel
                ? "form-label inline-block mb-2 text-black text-xl"
                : "form-label inline-block mb-2 text-gray-700"
            }
          >
            {this.props.label}
          </label>
          <div onChange={(e) => this.handleInputChange(e)}>
            <select
              className="form-select appearance-none
      block
      w-full
      px-3
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding bg-no-repeat
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              aria-label="Default select example"
            >
              {this.props.values.map((option) => {
                return (
                  <option key={option[1]} value={option[1]}>
                    {option[0]}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
    );
  }
}

export default InputComponent;
