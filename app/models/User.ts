import mongoose from 'mongoose';

export interface IUser {
  _id?: string;
  fullName: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters long'],
      maxlength: [50, 'Full name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
      validate: {
        validator: function (date: Date) {
          const today = new Date();
          const age = today.getFullYear() - date.getFullYear();
          return age >= 13 && age <= 120;
        },
        message: 'You must be between 13 and 120 years old',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Ensure we don't create the model multiple times in development
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
