"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./routes/users"));
const cdn_1 = __importDefault(require("./routes/cdn"));
const dbtest_1 = __importDefault(require("./routes/dbtest"));
const admin_model_1 = __importDefault(require("./models/admin.model"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db/db");
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = require("bcryptjs");
dotenv_1.default.config();
const PORT = process.env.PORT ?? 'default';
const MONGO_URI = process.env.MONGO_URI ?? 'default';
const app = (0, express_1.default)();
const sessionMiddleware = (0, express_session_1.default)({
    secret: crypto_1.default.randomBytes(32).toString('hex'),
    resave: true,
    saveUninitialized: true,
    store: connect_mongo_1.default.create({ mongoUrl: 'mongodb://localhost:27017/main_database', collectionName: 'sessions' }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
});
var cors = require('cors');
app.use(express_1.default.json());
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://dev.purinnova.online:5173');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
app.use("/api/users", users_1.default);
app.use("/api/cdn", sessionMiddleware, cdn_1.default);
app.use("/api/db", dbtest_1.default);
// Serve HTML file
app.get('/', sessionMiddleware, (req, res) => {
    if (req.session.user) {
        res.status(200).json({ type: 'session', success: true });
    }
    else {
        res.status(200).json({ success: true });
    }
});
app.get('/login', sessionMiddleware, async (req, res) => {
    if (req.session.user) {
        res.status(200).json({ type: 'session', success: true });
    }
    else {
        res.status(200).json({ type: 'session', success: false });
    }
});
app.post('/login', sessionMiddleware, express_1.default.urlencoded({ extended: true }), async (req, res) => {
    console.log(req.session);
    if (req.session.user) {
        res.status(200).json({ type: 'session', success: true });
    }
    else {
        const { name, email, password } = req.body;
        console.log(req.body);
        try {
            const adminQuery = await admin_model_1.default.findOne({ $or: [{ email: email }, { name: name }] });
            if (adminQuery) {
                const check = await (0, bcryptjs_1.compare)(password, adminQuery.password);
                if (check) {
                    req.session.user = name;
                    console.log(name);
                    console.log(req.session.user);
                    res.status(201).json({ type: 'login', success: true });
                }
                else {
                    res.status(401).json({ type: 'login', success: false });
                }
            }
            else {
                res.status(401).json({ type: 'login', success: false, message: 'no user' });
            }
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ type: 'error', message: 'An error occurred' });
        }
    }
});
app.listen(PORT, () => {
    (0, db_1.connectDB)();
    console.log(`Server is running at http://localhost:${PORT}`);
});
