import mongoose from "mongoose";

const Schema = mongoose.Schema;

// transform applied when we call .toObject or .toJSON
// explained at 3rd-4th comment https://stackoverflow.com/questions/31756673/what-is-the-difference-between-mongoose-toobject-and-tojson
const reshapingOptions = {
  virtuals: true, // include .id (it's a virtual)  
  versionKey: false,  // exclude .__v
  // exclude ._id
  transform: function (doc, ret) {
      delete ret._id;
      return ret;
  },
  getters:true,
};

const FormSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  fields: { type: [], required: true },
  // user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
  toJSON: reshapingOptions,
  toObject: reshapingOptions
});


const Form = mongoose.model('Form', FormSchema);
export default Form;