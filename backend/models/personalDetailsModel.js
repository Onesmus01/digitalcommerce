import mongoose from "mongoose";

const personalDetailsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      country: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
      },
    },

    avatar: {
      type: String, // Cloudinary URL or filename
    },

    isDefault: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const PersonalDetails = mongoose.model(
  "PersonalDetails",
  personalDetailsSchema
);

export default PersonalDetails;
