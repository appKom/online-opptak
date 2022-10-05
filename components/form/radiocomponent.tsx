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
  }
  render() {
    return (
      <div className="flex justify-center" key={this.props.id}>
        <div className="mb-3 xl:w-96">
          <label className={this.props.biggerlabel ? "form-label inline-block mb-2 text-black text-xl" : "form-label inline-block mb-2 text-gray-700"}>
            {this.props.label}
          </label>
          <div onChange={(e) => this.handleInputChange(e)}>
            {this.props.values.map((option) => {
              return (
                <div key={option[1]} className="form-check">
                  <input 
                    className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                    type="radio"
                    value={option[1]}
                    name={this.props.label}
                 
                  />
                  <label className="form-check-label inline-block text-gray-800">
                    {option[0]}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default InputComponent;
