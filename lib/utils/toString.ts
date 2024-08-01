export const changeDisplayName = (committee: string) => {
  if (committee.toLowerCase() === "kjelleren") {
    return "Realfagskjelleren";
  }
  return committee.charAt(0).toUpperCase() + committee.slice(1);
};
