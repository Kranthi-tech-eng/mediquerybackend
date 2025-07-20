import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());




const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.MONGO_URL;

mongoose.connect(MONGOURL).then(() => {
    console.log("database connected succesfully.")
    app.listen(PORT, () => {
        console.log(`Server is running on Port ${PORT}`)
    });
})
.catch((error) => console.log(error));


const myschema=new mongoose.Schema({
    name: String,
    uses: String,
    time: String,
    
});

const usermodel=mongoose.model("Medicines",myschema,"Medicines")


app.get('/api/search', async (req, res) => {
  const query = req.query.name;
  try {
    const result = await usermodel.findOne({ name: { $regex: query, $options: 'i' } });
    if (result) {
      res.json(result);
    } else {
      res.status(404).send('Medicine not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});