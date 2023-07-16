const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
let user = {
  id: "eoiisdhfkjfhewyrwuiawye",
  email: "johndoe@gmail.com",
  password: "123456788765432",
};

let JWT_SECRET = "SOME BIG SECRET....";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("homePage");
});
app.get("/forgot-password", (req, res) => {
  res.render("forgotPassword");
});

app.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new Error("input fields missing.");
    return;
  }

  if (email !== user.email) {
    throw new Error("Invalid email.");
    return;
  }
  let payload = user.id;
  let secret = JWT_SECRET + user.password;
  try {
    let token = jwt.sign({payload}, secret, { expiresIn: '15m' });
    let link = `http://localhost:5000/reset-password/${user.id}/${token}`;
    console.log(link)
    res.send('reset link sent.')
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/reset-password/:id/:token", (req, res) => {
  const { id } = req.params
  const { token } = req.params
console.log(id);
  if (id !== user.id) {
    throw new Error("id invalid.");
    return;
  }
  let secret = JWT_SECRET + user.password;
  try {
    let d = jwt.verify(token, secret)
     
    res.render("reset-password")

  } catch (error) {
    console.log(error);
  }


})


app.post('/reset-password/:id/:token',(req,res)=>{
    const{password}=req.body
    const { id } = req.params
    const { token } = req.params
  
    if (id !== user.id) {
      throw new Error("id invalid.");
      return
    }
    let secret = JWT_SECRET + user.password;

    try {
        let decoded=jwt.verify(token,secret)
        user.password=password
        res.json(user)
    } catch (error) {
        console.log(error);
    }
   

})

app.listen(5000, () => {
  console.log("listening to port 5000");
});
