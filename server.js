require ('dotenv').config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes/api_routes");
// const path = require("path");
const bill = require("./routes/invoice");
const PORT = process.env.PORT;

// // const cors = require("cors");
// app.use(cors({ origin: "https://your-frontend.netlify.app" }));

const app = express();
app.use(cors());
app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-url.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.get ("/", (req,res) => {
    res.send('Vrundavan API is live!');
})

app.use('/public', express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/invoice', express.static(path.join(__dirname, 'public/invoice')));

app.use("/", routes, bill);
app.listen(PORT, () => {
    console.log(`App is Running on server`);
})
