var PORT = process.env.PORT || 3000;

const express =  require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs");
app.use(express.static("public"));

var cantidadProductos = 10;

const listaProductos = {
  "alcoholGel" : "Alcohol Gel al 70%",
  "amoniocuaternario": "Amonio Cuaternario \n4ta Generacion\n",
  "jabonLiquido": "Jabon Liquido",
  "alcoholAtomizador": "Alcohol Antiseptico al \n70% con Atomizador\n",
  "alcohol": "Alcohol Antiseptico al 70%",
  "envaseAtomizador":  "Envase con Atomizador",
};



const listaCapacidades = {
   "30ml":"30ml",
   "100ml":"100ml",
   "150ml":"150ml",
   "200ml":"200ml",
   "300ml":"300ml",
   "500ml":"500ml",
   "600ml":"600ml",
   "1000ml": "1000ml",
   "medioGalon": "Medio Galon",
   "galon":"Galon",
   "cajaGuantes":"Caja de Guantes 50 Unidades",
};

const { createInvoice } = require("./createInvoice.js");



app.get("/", (req,res)=>{
    // createInvoice(invoice,"invoice.pdf");
    res.render("home", {
      listaProductos: listaProductos,
      listaCapacidades: listaCapacidades,
      cantidadProductos: cantidadProductos
    });
    // res.sendFile(__dirname + "/index.html");
});


app.post("/invoice", async (req,res)=>{
  console.log(req.body);
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
  var total = 0;
  //Agregar a itemList

  for(var i=0; i<cantidadProductos;i++){
    let productoKey = userForm["nombreProducto"+i]
    let capacidadKey = userForm["capacidadProducto"+i];
    let cantidad = parseInt(userForm["cantidadProducto"+i]);
    let precio = parseInt(userForm["precioProducto"+i]);
    if(!isNaN(cantidad) && !isNaN(precio)){
      let newItem = {
        item: listaProductos[productoKey],
        description: listaCapacidades[capacidadKey],
        quantity: cantidad,
        price: precio,
        total: precio*cantidad
      };
      total += precio*cantidad;
      itemList.push(newItem);
    }
  }

  console.log(itemList);
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
  