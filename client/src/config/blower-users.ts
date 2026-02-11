export interface BlowerUser {
  username: string;
  password: string;
  displayName: string;
  assignedLeadIds: string[] | "all";
  assignedBatches?: string[];  // if set, user only sees these batches
  dailyTarget?: number;        // default 20 if not set
}

export const BLOWER_USERS: BlowerUser[] = [
  {
    username: "edward",
    password: "edward",
    displayName: "Ed",
    assignedLeadIds: "all",
    dailyTarget: 20,
  },
  {
    username: "maximilian",
    password: "maximilian",
    displayName: "Max",
    assignedLeadIds: "all",  // will be derived from batches
    assignedBatches: ["bristol-physios"],
    dailyTarget: 1,
  },
];
