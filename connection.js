import { MongoClient } from "mongodb";
// const connection =MongoClient.connect("mongodb://127.0.0.1:27017")
const connection =MongoClient.connect("mongodb+srv://ritikarajwar0:987654321@cluster0.u2mqpbq.mongodb.net/playerdata?retryWrites=true&w=majority")
export const dbName='playerdata'
export default connection;
