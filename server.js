const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const DB_FILE = "locations.json";

if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, "[]");
}

app.post("/api/location", (req, res) => {

    const location = {
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        accuracy: req.body.accuracy,
        userAgent: req.headers["user-agent"],
        timestamp: new Date().toISOString()
    };

    const data = JSON.parse(fs.readFileSync(DB_FILE));

    data.push(location);

    fs.writeFileSync(
        DB_FILE,
        JSON.stringify(data, null, 2)
    );

    res.json({
        success: true
    });
});

app.get("/api/locations", (req, res) => {

    const data = JSON.parse(
        fs.readFileSync(DB_FILE)
    );

    res.json(data);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});