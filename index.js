import express from "express";
import cors from "cors";
import connection, { dbName } from "./connection.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";


const app = express();
const port = 8052;
let db;

app.use(express.json());
app.use(cors({ origin: "https://sport-front.onrender.com"}));
app.use(express.urlencoded({ extended: false }))
app.use('/uploads', express.static('uploads'))

const storageext = multer.diskStorage({
    destination: 'uploads/destination',
    filename: function (req, file, callback) {
        const ext = path.extname(file.originalname)
        const filename = req.body.newname + ext;
        callback(null, filename)
    }
})
// console.log(storageext)
const uploads = multer({ storage: storageext });

app.options("/", (req, res) => {
    res.header("Access-Control-Allow-Methods", "POST")
    res.sendStatus(200)
})

app.post('/login', async (req, res) => {
    let details =await db.collection('login').find().toArray()
    // console.log(details.length)
    // res.send(details)
    // res.send(JSON.stringify(details))
    let name = req.body.username
    let passcode = req.body.password
    let i
    let exist = true
    for (i = 0; i < details.length; i++) {
        if (details[i].username == name && details[i].password == passcode && exist) {

            // console.log('login successfull')

            i = details.length
            exist = false
        }

    }
    let token
    if (exist == false) {
        token = jwt.sign(
            { name },
            'secretkey',
            { expiresIn: 60 }
        )
        // console.log(token)
        res.send(JSON.stringify(token))
    }
    if (exist == true) {
        res.send(details)
    }



})


app.post("/playerrecord", async (req, res) => {
    let users = req.body.name
    let data = await db.collection('players').find({ newname : users}).toArray()
    // console.log(users)
    res.send(JSON.stringify(data))
})

app.post("/newentry", uploads.single("image"),  async (req, res) => {
    let {newname,serialno,aadharno,age,game,position,tournament,venue,state,organisedat} = req.body
    let photo = req.file
    // console.log(req.file)


    let existingPlayer = await db.collection('players').find().toArray()
    let adhar = req.body.aadharno
    // console.log(adhar)
    let exists = false

    

    for (let i=0;i<existingPlayer.length;i++){
        if(existingPlayer[i].aadharno==adhar){
            exists = true
        }
    }
    if(exists === true){
        console.log('data existed')
    }
    else{
        let data = await db.collection('players').insertOne({newname,serialno,aadharno,age,game,position,tournament,venue,state,organisedat,photo})
        console.log('data stored')
    }

})



connection.then((client) => {
    db = client.db(dbName);
    app.listen(port, () => console.log(port + " started"))
});