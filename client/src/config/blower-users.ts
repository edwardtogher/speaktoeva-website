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
  {
    username: "maximilian",
    password: "maximilian",
    displayName: "Max",
    assignedLeadIds: "all",
  },
];
