import { Schema, model } from 'mongoose';
import { User } from '../entities/user.js';

const userSchema = new Schema<User>({
  userName: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    require: String,
  },
  email: {
    type: String,
    unique: true,
    require: true,
  },
  firstName: {
    type: String,
    require: true,
  },
  surname: {
    type: String,
    require: true,
  },
  age: { type: Number },
  peopleWhoHate: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  peopleWhoLike: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

export const UserModel = model('User', userSchema, 'users2');
