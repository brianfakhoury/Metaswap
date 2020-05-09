const url = require("url");
const {MongoClient, ObjectID} = require("mongodb");

let cachedDb = null;

async function connectToDatabase(uri) {
    if (cachedDb) {
        return cachedDb;
    }

    const client = await MongoClient.connect(uri, {useNewUrlParser: true});

    const db = await client.db(url.parse(uri).pathname.substr(1));

    cachedDb = db;
    return db;
}

function build_html(item) {
    return `<!DOCTYPE html>
        <html>
        <head>
            <title>${item.title}</title>
            <meta property="og:title" content="${item.title}" />
            <meta property="og:image" content="${item.imageURL}" />
            <meta name="twitter:card" content="summary_large_image" />
            <script type="text/javascript">
                function redirect() {
                    window.location.replace("${item.url}");
                }
            </script>
        </head>
        <body onload="redirect()"></body>
        </html>`;
}

module.exports = async (req, res) => {
    const db = await connectToDatabase(process.env.MONGODB_URI);

    const id = req.query.id;

    if (id.length != 24) {
        res.send("Invalid ID")
        return
    }

    const collection = await db.collection("items");

    const item = await collection.findOne({
        _id: ObjectID.createFromHexString(id)
    });

    if (item) {
        res.send(build_html(item))
    } else {
        res.send("Not found!!")
    }
};
