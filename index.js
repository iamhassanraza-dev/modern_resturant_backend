const express = require('express');
const app = express();
const path = require('path');
const connectDB = require('./src/db/database');
const authRoutes = require('./src/routes/auth.routes');



const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 3000;


// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/templates"));



//cors
const cors = require('cors');
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));



//parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));


//database connection
connectDB();


//routes
app.use('/api/v1/auth', authRoutes);


//home route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "src/templates/home.html"));
});



// status page (HTML)
app.get("/status", (req, res) => {
    res.sendFile(path.join(__dirname, "src/templates/health.html"));
});


// health check
app.get("/health", (req, res) => {
    const uptimeSeconds = process.uptime();
    res.status(200).json({
        status: "ok",
        service: "Resturant Management",
        uptime: uptimeSeconds,
        timestamp: new Date().toISOString()
    });
});



//listen to the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});