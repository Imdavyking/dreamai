export type Account = {
  _id: string;
  name: string;
  account_type: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  address: string;
  __v: number;
  type: string;
};

export type User = {
  id: string;
  email: string;
  image_url: string;
  accounts: Account[];
  hasSetPrivateKey: boolean;
};

export type AccountType = {
  _id: string;
  title: string;
  name: string;
  parameters: {
    _id: string;
    name: string;
    value: string;
    type: string;
    hint: string;
    dataType: string;
  }[];
};

export type AccountPayload = {
  name: string;
  account_type_id: string;
  account_type: string;
  parameters: Array<{
    name: string;
    value: string;
    type: string;
  }>;
};

export type OutputType = {
  _id: string;
  flow_name: string;
  created_at: string;
  user_id: string;
  completed: boolean;
  outputs: [string];
};
