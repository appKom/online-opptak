export const fetchOwCommittees = async () => {
  return fetch(`/api/periods/ow-committees`).then((res) => res.json());
};
