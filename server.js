const express = require("express");
const multer = require("multer");
const cors = require("cors")
const app = express();
const Tesseract = require('tesseract.js');
const path = require("path");
const fs = require("fs");

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"))
app.use("/assets", express.static('assets'));
const upload = multer({ dest: 'uploads/' })

app.get("/", (req, res) => {
  res.render("index", {text: false})
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

app.listen(80, ()=>{
  const directoryPath  = __dirname+"/uploads";
  fs.readdir(directoryPath, (err, files)=>{
    if(err){
      console.log(err);
      return ;
    }

    files.forEach((file)=>{
      const filePath = path.join(__dirname,"/uploads/", file);
      fs.unlink(filePath, (err)=>{
        if (err) {console.log(err); return;};
      })
    })
  })
 console.log("Server is running")
});
