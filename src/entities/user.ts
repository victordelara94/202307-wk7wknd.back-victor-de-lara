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
  peopleWhoHate: User[];
  peopleWhoLike: User[];
};
