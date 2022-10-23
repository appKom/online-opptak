import React from 'react'

interface Props {
    data: {
        navn: String,
        epost: String,
        telefon: String,
        omdegselv: String,
        informatikkar: Number,
        komitevalg1: String,
        komitevalg2: String,
        komitevalg3: String,
        okonomiansvarliginteresse: Boolean,
        feminit: Boolean
    }
}

const Applicantrow = (props: Props) => {
  return (
    <tr> {/* En rad i tabellen */}
        <td className="p-1">{props.data.navn}</td>
        <td className="p-1">{props.data.epost}</td>
        <td className="p-1">{props.data.telefon}</td>
    </tr>
  )
}

export default Applicantrow