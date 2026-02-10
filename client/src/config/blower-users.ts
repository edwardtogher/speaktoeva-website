export interface BlowerUser {
  username: string;
  password: string;
  displayName: string;
  assignedLeadIds: string[] | "all";
}

export const BLOWER_USERS: BlowerUser[] = [
  {
    username: "edward",
    password: "edward",
    displayName: "Ed",
    assignedLeadIds: "all",
  },
  // Add friends here:
  // {
  //   username: "joe",
  //   password: "joe",
  //   displayName: "Joe",
  //   assignedLeadIds: ["lead-id-1", "lead-id-2"],
  // },
];
