const express = require("express");
const { connectToMongoDB } = require("./connect");
const path = require('path');
const urlRoute = require("./routes/url");
const URL = require('./models/url');
const app = express();
const PORT = 8001;
const staticRoute = require("./routes/staticRouter")


connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(() => console.log("mongodb connected"));

app.set("view engine", "ejs");
app.set("views" , path.resolve("./views"));

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use("/url", urlRoute);
app.use("/", staticRoute);

app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, {
        $push: {
            visitHistory: {
                timestamp: Date.now()
            },
        },
    })
    res.redirect(entry.redirectURL);
})



app.listen(PORT, () => console.log(`server started at PORT: ${PORT}`))