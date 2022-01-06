const stripe = require('stripe')(process.env.STRIPE_KEY);
const Rcon = require('modern-rcon');

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

const rcon = new Rcon(process.env.MCSERVER, port = 25575, process.env.MCSERVERPWRD, timeout = 5000);

module.exports = {
  hook: async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
    console.log(event);
    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const commands = JSON.parse(event.data.object.metadata.commands);
      if (commands) {
        rcon.connect().then(() => {
          commands.forEach(async (cmd) => {
            rcon.send(cmd).then((result) => {
              console.log(result);
            });
          });
        }).then(() => {
          rcon.disconnect();
        });
      }
    } else {
      console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  },
};
