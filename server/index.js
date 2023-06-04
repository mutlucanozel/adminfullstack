import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import clientRoutes from './routes/client.js';
import generalRoutes from './routes/general.js';
import managementRoutes from './routes/management.js';
import salesRoutes from './routes/sales.js';
import User from './models/User.js';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import jwt from 'jsonwebtoken';
import Product from './models/Product.js';
import ProductStat from './models/ProductStat.js';
import stripe from 'stripe';
import Transaction from './models/Transaction.js';
import OverallStat from './models/OverallStat.js';
import AffiliateStat from './models/AffiliateStat.js';
import stripePackage from 'stripe';
import bcrypt from 'bcrypt';
import {
  dataUser,
  dataProduct,
  dataProductStat,
  dataTransaction,
  dataOverallStat,
  dataAffiliateStat,
} from './data/index.js';

mongoose.connect(
  'mongodb+srv://mutlu26:m1u2t3l4u5@cluster0.6plqkha.mongodb.net/?retryWrites=true&w=majority'
);

/* CONFIGURATION */
dotenv.config();
const app = express();

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* ROUTES */
app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use('/client', clientRoutes);
app.use('/general', generalRoutes);
app.use('/management', managementRoutes);
app.use('/sales', salesRoutes);

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.get("/users/cusid", async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    const cusid = user.cusid;

    res.status(200).json({ cusid });
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});


app.post('/useregister', async (req, res) => {
  try {
    const { name, email, password, city, state, country, occupation, phoneNumber } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a customer on the connected account in Stripe
    const connectedAccountId = 'acct_1LsSSrQjKkdK0c1D'; // Replace with your actual connected account ID

    // Replace with your actual Stripe secret key
    

    const stripeInstance = stripe('sk_test_51LrKnIHO7XYPxtMQSdkXp4g5Y7TrJLFLwlBWzBbebdXlfOR6x8fegkmsZSSBiBxgDXHR1168vpvK53KVr6AFeRmz00zMks1hWy');

    // Generate a card token using Stripe.js or Elements on the client-side
    const { cardToken } = req.body;

    // Create a customer on the connected account in Stripe
    const customer = await stripeInstance.customers.create(
      {
        email,
        source: cardToken,
      },
      {
        stripeAccount: connectedAccountId,
      }
    );
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the customer ID to the 'cusid' field in the User model
    const user = new User({
      name,
      email,
      password: hashedPassword,
      city,
      state,
      country,
      occupation,
      phoneNumber,
      cusid: customer.id,
    });

    // Save user to the database
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/userlogin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and send token
    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/products/add', upload.single('image'), async (req, res) => {
  const { title, body, url } = req.body;
  try {
    const { name, price, description, Km, modelyear, category, image, phoneno } = req.body;

    const product = new Product({
      name,
      price,
      description,
      Km,
      modelyear,
      category,
      image,
      phoneno,
    });
    await product.save();
    res.send(product);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/products/delete', async (req, res) => {
  const { productid } = req.body;
  try {
    await Product.deleteOne({ _id: productid });
  } catch (error) {
    console.log(error);
  }
});
app.post("/transactions", async (req, res) => {
  const { userId, cost, name, number, expmonth, expyear, cvc } = req.body;
  try {
   

    const stripeInstance = stripe('sk_test_51LrKnIHO7XYPxtMQSdkXp4g5Y7TrJLFLwlBWzBbebdXlfOR6x8fegkmsZSSBiBxgDXHR1168vpvK53KVr6AFeRmz00zMks1hWy');

    const paymentMethod = await stripeInstance.paymentMethods.create({
      type: 'card',
      card: {
        number: number,
        exp_month: expmonth,
        exp_year: expyear,
        cvc: cvc,
      },
    }, {
      stripeAccount: 'acct_1LsSSrQjKkdK0c1D',
    });

    const paymentMethodId = paymentMethod.id;
    console.log(paymentMethodId);

    await stripeInstance.paymentMethods.attach(paymentMethodId, {
      customer: userId,
    }, {
      stripeAccount: 'acct_1LsSSrQjKkdK0c1D',
    });

    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: cost,
      currency: 'try',
      payment_method_types: ['card'],
      description: 'asdasd',
      customer: userId,
      receipt_email: 'asd@asd.com',
      payment_method: paymentMethodId,
      confirm: true,
      error_on_requires_action: true,
      confirmation_method: 'manual',
      setup_future_usage: 'off_session',
    }, {
      stripeAccount: 'acct_1LsSSrQjKkdK0c1D',
    });

    if (paymentIntent.status === 'succeeded') {
      // Payment succeeded
      const transaction = new Transaction({ userId, cost, name, number, expmonth, expyear, cvc });
      await transaction.save();
      console.log(transaction);
      res.status(201).json({ transaction, status: 'succeeded' });
    } else if (paymentIntent.status === 'requires_payment_method') {
      // Payment requires a new payment method
      const transaction = new Transaction({ userId, cost, name, number, expmonth, expyear, cvc });
      await transaction.save();
      console.log(transaction);
      res.status(402).json({ error: 'Your card was declined.', status: 'declined' });
    } else {
      // Other payment errors
      res.status(500).json({ error: 'Payment error occurred.', status: 'error' });
    }
  } catch (error) {
    console.error("Transaction ekleme hatası:", error);
    if (error.code === 'card_declined') {
      res.status(402).json({ error: 'Your card was declined.', status: 'declined' });
    } else {
      res.status(500).json({ error: "Transaction eklenirken bir hata oluştu.", status: 'error' });
    }
  }
});



/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /*ONLY ADD DATA ONE TIME */
    //AffiliateStat.insertMany(dataAffiliateStat);
    //OverallStat.insertMany(dataOverallStat);
    //Product.insertMany(dataProduct);
    //ProductStat.insertMany(dataProductStat);
    //Transaction.insertMany(dataTransaction);
    //User.insertMany(dataUser);
  })
  .catch((error) => console.log(`${error} did not connect`));

app.use(cookieParser());
app.use(express.json());
app.use('/', authRoutes);

export default app;
