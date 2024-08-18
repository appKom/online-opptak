import PhoneInput from "react-phone-input-2";

interface Props {
  updateInputValues: Function;
  label: string;
  defaultValue?: string;
}

const CustomPhoneInput = (props: Props) => (
  <div className="w-full max-w-xs pb-2 mx-auto my-6">
    <label className="px-1 text-xs text-gray-500 transition bg-white -top-2 left-2 dark:bg-gray-900 dark:text-gray-200">
      Telefonnummer
    </label>
    <PhoneInput
      country="no"
      inputStyle={{
        width: "100%",
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
      }}
      value={props.defaultValue}
      onChange={(text) => props.updateInputValues(text)}
    />
  </div>
);

export default CustomPhoneInput;
