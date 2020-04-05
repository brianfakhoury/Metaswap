const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, "public")));

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, error => {
    error ? console.error(error) : console.log("-------> MongoDB connected!!");
});

const Item = mongoose.model(
    "Item",
    new mongoose.Schema({
        title: String,
        imageURL: String,
        url: String
    })
);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/a/*", (req, res) => {
    Item.findById(req.path.substring(3), (err, item) => {
        if (err) {
            console.log(err);
            res.send("ERROR");
        } else if (!item) {
            res.send("NOT FOUND");
        } else {
            res.send(build_html(item));
        }
    });
});

app.post("/", (req, res) => {
    var new_item = new Item({
        title: req.body.title,
        imageURL: req.body.imageURL,
        url: req.body.url
    });
    new_item.save();
    res.send(new_item._id);
});

function build_html(item) {
    return `<!DOCTYPE html>
        <html>
        <head>
            <title>${item.title}</title>
            <meta property="og:title" content="${item.title}" />
            <meta property="og:url" content="${item.url}" />
            <meta property="og:image" content="${item.imageURL}" />
            <script type="text/javascript">
                function redirect() {
                    setTimeout(function() {
                        window.location.replace("${item.url}");
                    }, 2000);
                }
            </script>
        </head>
        <body onload="redirect()"></body>
        </html>`;
}

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);
