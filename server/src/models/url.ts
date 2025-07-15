import mongoose, { Document, Schema } from "mongoose";

export interface Url {
  shortId: string;
  redirectUrl: string;
  visitHistory: {
    timestamp: Date;
  }[];
}

export interface UrlDocument extends Url, Document {}

const urlSchema = new Schema<UrlDocument>(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    redirectUrl: {
      type: String,
      required: true,
    },
    visitHistory: [
      {
        timestamp: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const UrlModel = mongoose.model<UrlDocument>("url", urlSchema);
