export type Login = {
  userName: string;
  password: string;
};

export type User = Login & {
  id: string;
  email: string;
  firstName: string;
  surname: string;
  age: number;
  enemies: User[];
  friends: User[];
};
