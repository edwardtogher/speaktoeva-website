export interface BlowerUser {
  username: string;
  password: string;
  displayName: string;
  assignedLeadIds: string[] | "all";
  assignedBatches?: string[];  // if set, user only sees these batches
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
    assignedLeadIds: "all",  // will be derived from batches
    assignedBatches: [],     // add batch IDs here when importing leads for Max
  },
];
