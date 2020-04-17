const User = require('../models/user');
const braintree = require('braintree');
// require('dotenv').config();

const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox, // Production
    merchantId: 'yxvdkpjnqpq46zg8',
    publicKey: 'process.env.BRAINTREE_PUBLIC_KEY',
    privateKey: '6d793fedf26dce0b1dbeeb05b6e612db'
});

exports.generateToken = (req, res) => {
    gateway.clientToken.generate({}, function(err, response) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(response);
        }
    });
};

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;
    // charge
    let newTransaction = gateway.transaction.sale(
        {
            amount: amountFromTheClient,
            paymentMethodNonce: nonceFromTheClient,
            options: {
                submitForSettlement: true
            }
        },
        (error, result) => {
            if (error) {
                res.status(500).json(error);
            } else {
                res.json(result);
            }
        }
    );
};
