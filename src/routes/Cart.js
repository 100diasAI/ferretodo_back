const express = require('express');
const router = express.Router();
const { Cart, Producto } = require('../db');

// Obtener el carrito de un usuario
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: Producto }],
    });
    res.json(cartItems);
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ message: 'Error al obtener el carrito', error: error.message });
  }
});

// Añadir un producto al carrito
router.post('/', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const [cartItem, created] = await Cart.findOrCreate({
      where: { userId, productId },
      defaults: { quantity },
    });
    if (!created) {
      cartItem.quantity += quantity;
      await cartItem.save();
    }
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir al carrito', error });
  }
});

// Actualizar la cantidad de un producto en el carrito
router.put('/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;
    const cartItem = await Cart.findOne({ where: { userId, productId } });
    if (cartItem) {
      cartItem.quantity = quantity;
      await cartItem.save();
      res.json(cartItem);
    } else {
      res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el carrito', error });
  }
});

// Eliminar un producto del carrito
router.delete('/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const deleted = await Cart.destroy({ where: { userId, productId } });
    if (deleted) {
      res.json({ message: 'Producto eliminado del carrito' });
    } else {
      res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar del carrito', error });
  }
});

module.exports = router;
