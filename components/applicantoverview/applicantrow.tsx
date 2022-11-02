import React from "react";
import { DBapplicant } from "../../types";

interface Props {
  data: DBapplicant;
}

const Applicantrow = (props: Props) => {
  return (
    <tr>
      <td className="p-1">{props.data.name}</td>
      <td className="p-1">{props.data.email}</td>
      <td className="p-1">{props.data.phone}</td>
    </tr>
  );
};

export default Applicantrow;
