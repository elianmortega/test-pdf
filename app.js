var PORT = process.env.PORT || 3000;

const express =  require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();

const { createInvoice } = require("./createInvoice.js");

app.use(bodyParser.urlencoded({ extended: true }))

const invoice = {
    shipping: {
      name: "John Doe",
      address: "1234 Main Street",
      city: "San Francisco",
      state: "CA",
      country: "US",
      postal_code: 94111
    },
    items: [
      {
        item: "TC 100",
        description: "Toner Cartridge",
        quantity: 2,
        amount: 6000
      },
      {
        item: "USB_EXT",
        description: "USB Cable Extender",
        quantity: 1,
        amount: 2000
      }
    ],
    subtotal: 8000,
    paid: 0,
    invoice_nr: 1234
  };


app.get("/", (req,res)=>{
    // createInvoice(invoice,"invoice.pdf");
    
    res.sendFile(__dirname + "/index.html");
});

app.get("/pdf", (req,res)=>{});

app.post("/invoice", (req,res)=>{
    console.log(req.body);
    var data = fs.readFileSync(__dirname + "/invoice.pdf");
    res.contentType("application/pdf");
    res.send(data);
});

app.listen(PORT, ()=>{
    console.log("App listening on port 3000");
});

  
  
  
  
  