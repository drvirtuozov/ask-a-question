import mongoose from 'mongoose';

const counterSchema = mongoose.Schema({
  _id: String,
  count: { type: Number, default: 0, min: 0 }
});

export default mongoose.model("Counter", counterSchema);