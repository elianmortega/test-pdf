var PORT = process.env.PORT || 3000;

const express =  require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const eja = require("ejs");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs");
app.use(express.static("public"));

const listaProductos = [
  {nombre : "Alchol 30ml", id:"al30"},
  { nombre : "Alchol 60ml", id:"al60"},
  {nombre : "Alchol 90ml", id:"al90"},
  {nombre : "Alchol 100ml", id:"al100"},
]


const { createInvoice } = require("./createInvoice.js");



app.get("/", (req,res)=>{
    // createInvoice(invoice,"invoice.pdf");
    res.render("home", {
      listaProductos: listaProductos,
    });
    // res.sendFile(__dirname + "/index.html");
});


app.post("/invoice", async (req,res)=>{
  var map = req.body;
    console.log(map);
    var invoice = await crearProforma(req.body);
    await createInvoice(invoice,"invoice.pdf");
    setTimeout(function () {
      var data = fs.readFileSync(__dirname + "/invoice.pdf");
      res.contentType("application/pdf");
      res.send(data);
    }, 2000);
});

app.listen(PORT, ()=>{
    console.log("App listening on port 3000");
});

  
  
function crearProforma(userForm){
  // console.log(isNaN(parseInt(userForm["al30"])));
  let itemList = Array();
  //Agregar a itemList
  listaProductos.forEach((producto)=>{
    let cantidad = parseInt(userForm[producto.id]);
    if(!isNaN(cantidad)){
      let newItem = {
        item: producto.nombre,
        description: "Descripcion",
        quantity: cantidad,
        amount: 0
      };
      itemList.push(newItem);
    }
  });

  var invoice = {
    shipping: {
      name: userForm.nombreCliente,
      address: "1234 Main Street",
      city: "San Francisco",
      state: "CA",
      country: "US",
      postal_code: 94111
    },
    items: itemList,
    subtotal: 8000,
    paid: 0,
    invoice_nr: 1234
  };
  return invoice;
}
  