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
    symptoms: [String],
    
});

const usermodel=mongoose.model("mydata",myschema,"mydata")



app.get('/api/search', async (req, res) => {
  const query = req.query.name;

  try {
    // 1. Try searching by medicine name
    const med = await usermodel.findOne({ name: { $regex: query, $options: 'i' } });

    if (med) {
      return res.json({
        type: "medicine",
        name: med.name,
        uses: med.uses,
        time: med.time,
      });
    }

    // 2. If not found by name, try searching by symptom
    const medsBySymptom = await usermodel.find({ symptoms: { $regex: query, $options: 'i' } });

    if (medsBySymptom.length > 0) {
      return res.json({
        type: "symptom",
        symptom: query,
        medicines: medsBySymptom.map(med => ({
          name: med.name,
          uses: med.uses,
          time: med.time,
        })),
      });
    }

    // 3. If nothing found
    res.status(404).json({ message: 'No matching medicine or symptom found' });

  } catch (err) {
    res.status(500).send(err.message);
  }
});



