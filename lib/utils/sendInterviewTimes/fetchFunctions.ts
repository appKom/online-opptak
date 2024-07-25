import { committeeEmails, owCommitteeType } from "../../types/types";

export const fetchCommitteeEmails = async (): Promise<committeeEmails[]> => {
  try {
    const baseUrl =
      "https://old.online.ntnu.no/api/v1/group/online-groups/?page_size=999";

    const excludedCommitteeNames = [
      "HS",
      "Komiteledere",
      "Pangkom",
      "Fond",
      "Æresmedlemmer",
      "Bed&Fagkom",
      "Bekk_påmeldte",
      "booking",
      "Buddy",
      "CAG",
      "Eksgruppa",
      "Eldsterådet",
      "Ex-Komiteer",
      "interessegrupper",
      "ITEX",
      "ITEX-påmeldte",
      "kobKom",
      "Komiteer",
      "Redaksjonen",
      "Riddere",
      "techtalks",
      "Ex-Hovedstyret",
      "Tillitsvalgte",
      "Wiki - Komiteer access permissions",
      "Wiki - Online edit permissions",
      "X-Sport",
    ];

    const response = await fetch(baseUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();

    const groups = data.results
      .filter(
        (group: { name_short: string }) =>
          !excludedCommitteeNames.includes(group.name_short)
      )
      .map((group: owCommitteeType) => ({
        name_short: group.name_short,
        name_long: group.name_long,
        email: group.email,
        description_short: group.description_short,
        description_long: group.description_long,
        image: group?.image,
        application_description: group.application_description,
      }));

    return groups;
  } catch (error) {
    console.error(error);
    return [];
  }
};
