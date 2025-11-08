import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../types';

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  passwordHash: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  collection: 'users'
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Static method to create user with hashed password
userSchema.statics.createUser = async function(
  username: string,
  email: string,
  password: string
): Promise<IUser | null> {
  try {
    // Check if user already exists
    const existingUser = await this.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return null;
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.create({
      username,
      email,
      passwordHash
    });

    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Static method to verify password
userSchema.statics.verifyPassword = async function(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
};

// Instance method to verify password
userSchema.methods.verifyPassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

// Remove password hash from JSON output
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

export const User = mongoose.model<IUser>('User', userSchema);
