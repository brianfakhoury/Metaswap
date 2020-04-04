const express = require("express");
var path = require("path");
var fs = require("fs");

const app = express();
const port = 3000;
app.use(express.urlencoded());

data_dictionary = require("./store.json");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/*", (req, res) => {
    data = data_dictionary[req.path.substring(1)];
    if (data) {
        res.send(build_html(data));
    } else {
        res.send("NOT FOUND");
    }
});

app.post("/", (req, res) => {
    var new_item = {
        title: req.body.title,
        imageURL: req.body.imageURL,
        url: req.body.url
    };
    var id = makeid(8);
    update_store(id, new_item);
    res.send(id);
});

function makeid(length) {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}

function build_html(item) {
    return `<!DOCTYPE html>
        <html><head>
        <title>${item.title}</title>
        <meta property="og:title" content="${item.title}" />
        <meta property="og:url" content="${item.url}" />
        <meta property="og:image" content="${item.imageURL}" />
        </head><body>
        <script type="text/javascript">
            window.location.replace("${item.url}");
        </script>
        </body></html>`;
}

function update_store(id, new_item) {
    data_dictionary[id] = new_item;
    fs.writeFile("store.json", JSON.stringify(data_dictionary), function(err) {
        if (err) {
            console.log(err);
        }
    });
}

app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port}`)
);
