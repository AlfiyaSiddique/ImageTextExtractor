const express = require("express");
const multer = require("multer");
const cors = require("cors")
const app = express();
const Tesseract = require('tesseract.js');

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
const upload = multer({ dest: 'uploads/' })

app.get("/", (req, res) => {
  res.render("index", {text: ""})
})

app.post("/api/fileanalyse", upload.single("upfile"), (req, res) => {
  try{
      const data = {
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  }
  if(req.headers['origin'] === 'https://www.freecodecamp.org'){
  res.json(data);
}else{
    const image = req.file.path;

    Tesseract.recognize(image)
      .then((result) => {
        res.render("index", {text: result.data.text});
      })
      .catch((err) => {
        console.log(err);
        res.send('Error occurred during text extraction');
      });
}
  }catch(e){
    console.log(e)
  }

})

app.listen(80, () => console.log("server is running at port 80"));
