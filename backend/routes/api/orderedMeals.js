import { Router } from 'express';
import { auth } from '../../config/passport.js';
import orderedMeals from '../../models/orderedMealsModel.js';
import User from '../../models/UsersModel.js';

const router = Router();

router.get('/', auth, async (req, res) => {
    const { username } = req.query;
    const user = await User.findOne({ username: username }).exec();
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(user.orderedMeals);
});


router.post('/addNewItem', auth, (req, res) => {
    const { mealName, quantity, mealId, price } = req.body;

    try {
        const orderedMeal = new orderedMeals({
            mealName: mealName,
            quantity: quantity,
            mealId: mealId,
            price: price
        });

        const updatedUser = User.findByIdAndUpdate(
            { _id: req.user._id },
            { $push: { orderedMeals: orderedMeal } },
            { new: true }
        ).exec();

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Ordered meal added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/addItem', auth, async (req, res) => {
    const { quantity, mealId } = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.user._id, "orderedMeals.mealId": mealId },
            { $set: { "orderedMeals.$.quantity": quantity } },
            { new: true }
        ).exec();

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Ordered meal added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/updateCart', auth, async (req, res) => {
    const { newCart } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            { _id: req.user._id },
            { $set: { "orderedMeals": newCart } },
            { new: true }
        ).exec();

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Cart updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/deleteCart', auth, async (req, res) => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { orderedMeals: [] } },
        { new: true }
      ).exec();
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json({ message: 'Order confirmed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

export default router; 