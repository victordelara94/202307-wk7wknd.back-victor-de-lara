type Id = {
  id: string;
};
export type Login = {
  userName: string;
  password: string;
};

export type UserNoId = Login & {
  email: string;
  firstName: string;
  surname: string;
  age: number;
  peopleWhoHate: User[];
  peopleWhoLike: User[];
};
export type User = UserNoId & Id;
