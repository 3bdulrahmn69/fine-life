import mongoose, { Document, Schema } from 'mongoose';

export interface IUserPreferences extends Document {
  userId: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserPreferencesSchema = new Schema<IUserPreferences>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.UserPreferences ||
  mongoose.model<IUserPreferences>('UserPreferences', UserPreferencesSchema);
