export const changeDisplayName = (committee: string) => {
  if (committee.toLowerCase() === "kjelleren") {
    return "Realfagskjelleren";
  }
  return committee.charAt(0).toUpperCase() + committee.slice(1);
};

export function formatPhoneNumber(phoneNumber: string) {
  const countryCode = "(+" + phoneNumber.slice(0, 2) + ")";
  const restOfNumber = phoneNumber.slice(2);

  const formattedNumber = restOfNumber.replace(
    /(\d{3})(\d{2})(\d{3})/,
    "$1 $2 $3"
  );

  return `${countryCode} ${formattedNumber}`;
}
