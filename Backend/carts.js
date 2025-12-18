var express = require('express');
var router = express.Router();

let activeCarts = [
  {
    cartID: "777",
    cartItems: [
      {
        title: "Fresh Strawberries",
        description: "Assorted sizes, 2 cartons",
        cost: 200,
        imageUrl: "/images/strawberries.svg"
      },
      {
        title: "Fresh Blackberries",
        description: "Assorted sizes, 2 cartons",
        cost: 295,
        imageUrl: "/images/blackberries.svg"
      }
    ]
  },
  {
    cartID: "888",
    cartItems: [
      {
        title: "Yummy cookies",
        description: "Flour and chocolate chips",
        cost: 150,
        imageUrl: "/images/cookies.svg"
      }
    ]
  }
]

router.get('/:id', function (req, res, next) {
  let cart = activeCarts.find(x => x.cartID === req.params.id)
  if (cart === undefined) {
    let err = new Error('Cart was not found.');
    err.status = 404;
    return next(err);
  }

  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", 0);
  res.status(200).json(cart);
});

module.exports = router;
