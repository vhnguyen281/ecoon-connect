import { Schema, model, models } from "mongoose";

const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    property: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    body: { type: String },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Message = models.Message || model("Message", messageSchema);

export default Message;
