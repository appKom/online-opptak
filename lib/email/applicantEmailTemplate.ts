import { emailDataType } from "../types/types";

export const generateApplicantEmail = (emailData: emailDataType) => {
  return `
  <!DOCTYPE html>
  <html lang="no">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        padding: 20px;
        background-color: #f9f9f9;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background-color: #fff;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }
      .header {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
      }
      .header img {
        height: 40px;
      }
      p {
        margin-bottom: 10px;
        margin-top: 10px;
      }
      .content strong {
        color: #2c3e50;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://www.ntnu.no/documents/144448/0/Online_logo_2021.png/fcc93412-84f4-5f39-a7e0-ba269d1ed807?t=1620030827984" alt="Online Logo" />
        <p>Vi har mottatt din søknad!</p>
      </div>
      <div class="content">
        <p>Dette er en bekreftelse på at vi har mottatt din søknad. Du vil motta en ny e-post med intervjutider etter søkeperioden er over.</p>
        <p>Her er en oppsummering av din søknad:</p>
        <p><strong>E-post:</strong> ${emailData.emails[0]}</p>
        <p><strong>Fullt navn:</strong> ${emailData.name}</p>
        <p><strong>Telefonnummer:</strong> ${emailData.phone}</p>
        <p><strong>Trinn:</strong> ${emailData.grade}</p>
        <p><strong>Førstevalg:</strong> ${emailData.firstChoice}</p>
        <p><strong>Andrevalg:</strong> ${emailData.secondChoice}</p>
        <p><strong>Tredjevalg:</strong> ${emailData.thirdChoice}</p>
        <p><strong>Ønsker du å være økonomiansvarlig:</strong> ${emailData.bankom}</p>
        <p><strong>Komiteer søkt i tillegg:</strong> ${emailData.optionalCommittees}</p>
        <p><strong>Kort om deg selv:</strong></p>
        <p>${emailData.about}</p>
      </div>
    </div>
  </body>
  </html>
  `;
};
