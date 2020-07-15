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
  {nombre : "Alcohol Gel al 70%", id:"alGel"},
  {nombre : "Amonio Cuaternario \n4ta Generacion\n", id:"amonio"},
  {nombre : "Jabon Liquido", id:"jabon"},
  {nombre : "Alcohol Antiseptico al \n70% con Atomizador\n", id:"alAtom"},
  {nombre : "Alcohol Antiseptico al 70%", id:"al"},
  {nombre : "Atomizador con envase", id:"atomEnvase"},
]

const listaCapacidades = [
  {nombre: "30ml", valor: 30},
  {nombre: "100ml", valor: 100},
  {nombre: "150ml", valor: 150},
  {nombre: "200ml", valor: 200},
  {nombre: "300ml", valor: 300},
  {nombre: "500ml", valor: 500},
  {nombre: "600ml", valor: 600},
  {nombre: "1000ml", valor: 1000},
  {nombre: "Medio Galon", valor: 1500},
  {nombre: "Galon", valor: 300},
  {nombre: "Caja de 50 Unidades", valor: 300},
];

const { createInvoice } = require("./createInvoice.js");



app.get("/", (req,res)=>{
    // createInvoice(invoice,"invoice.pdf");
    res.render("home", {
      listaProductos: listaProductos,
      listaCapacidades: listaCapacidades,
    });
    // res.sendFile(__dirname + "/index.html");
});


app.post("/invoice", async (req,res)=>{
  console.log(req.body);
  var map = req.body;
    // console.log(map);
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
  var total = 0;
  //Agregar a itemList
  listaProductos.forEach((producto)=>{
    let cantidad = parseInt(userForm["cant"+producto.id]);
    let precio = parseInt(userForm["precio"+producto.id]);
    let descripcion = userForm["select"+producto.id]
    if(!isNaN(cantidad)){
      let newItem = {
        item: producto.nombre,
        description: descripcion,
        quantity: cantidad,
        price: precio,
        total: precio*cantidad
      };
      total += precio*cantidad;
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
    total: total,
  };
  return invoice;
}
  