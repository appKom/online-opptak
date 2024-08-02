import { committeeEmails, owCommitteeType } from "../../types/types";

export const fetchCommitteeEmails = async (): Promise<committeeEmails[]> => {
  try {
    const response = await fetch(
      "https://old.online.ntnu.no/api/v1/group/online-groups/?page_size=999"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();

    const groups = data.results.map((group: owCommitteeType) => ({
      name_short: group.name_short,
      email: group.email,
    }));

    return groups;
  } catch (error) {
    console.error(error);
    return [];
  }
};
