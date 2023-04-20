import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderedMealsSchema = new Schema({
    mealName: { type: String, required: true },
    quantity: { type: Number, required: true },
    mealId: { type: String, required: true },
    price: { type: Number, required: true }
});

const orderedMeals = mongoose.model('orderedMeals', orderedMealsSchema);

export default orderedMeals;
export { orderedMealsSchema }; 