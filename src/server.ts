require("dotenv").config();
// import cookieSession from "cookie-session";
import cors from "cors";
import express, { Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import routes from "./routes/routes";
var MongoDBStore = require("connect-mongodb-session")(session);

// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
const allowedOrigins = [process.env.CLIENT_URL, process.env.API];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "PUT", "POST", "DELETE"],
  credentials: true,
};

let store = MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "mySessions",
  expires: 1000 * 60 * 60 * 24 * 14,
});

const app = express();

const port = process.env.PORT;

app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SECRET,
    store: store,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    name: "letsfeast",
    // cookie: { secure: true },
  })
);
app.use(cors(options));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

app.get("/", (req: Request, res: Response) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
