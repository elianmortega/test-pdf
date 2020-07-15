const fs = require("fs");
const PDFDocument = require("pdfkit");

var globalPosition = 0;

function createInvoice(invoice, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateExtraInformation(doc);
  generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc) {
  doc
    .image("logo.jpg", 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("Cosmeticos Orvel", 110, 57)
    .fontSize(10)
    .text("ANTIGUA CINERUIZ 1 1/2 C. OESTE", 200, 50, { align: "right" })
    .text(formatDate(new Date()), 200, 65, { align: "right" })
    .text("MANAGUA, NICARAGUA", 200, 80, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {

  // const customerInformationTop = 200;

  // doc
  //   .fontSize(10)
  //   .text("Invoice Number:", 50, customerInformationTop)
  //   .font("Helvetica-Bold")
  //   .text(invoice.invoice_nr, 150, customerInformationTop)
  //   .font("Helvetica")
  //   .text("Invoice Date:", 50, customerInformationTop + 15)
  //   .text(formatDate(new Date()), 150, customerInformationTop + 15)
  //   .text("Balance Due:", 50, customerInformationTop + 30)
  //   .text(
  //     formatCurrency(invoice.subtotal - invoice.paid),
  //     150,
  //     customerInformationTop + 30
  //   )

  //   .font("Helvetica-Bold")
  //   .text(invoice.shipping.name, 300, customerInformationTop)
  //   .font("Helvetica")
  //   .text(invoice.shipping.address, 300, customerInformationTop + 15)
  //   .text(
  //     invoice.shipping.city +
  //       ", " +
  //       invoice.shipping.state +
  //       ", " +
  //       invoice.shipping.country,
  //     300,
  //     customerInformationTop + 30
  //   )
  //   .moveDown();

  // generateHr(doc, 252);

  doc
    .fillColor("#444444")
    .fontSize(12)
    .text(invoice.shipping.name.toUpperCase(), 50, 160);

  generateHr(doc, 185);

  
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 200;
  doc.font("Helvetica-Bold");
  doc.fontSize(10);
  generateTableRow(
    doc,
    invoiceTableTop,
    "PRODUCTO",
    "CAPACIDAD",
    "PRECIO",
    "CANTIDAD",
    "TOTAL"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 35;
    generateTableRow(
      doc,
      position,
      item.item,
      item.description,
      formatCurrency(item.price),
      item.quantity,
      formatCurrency(item.total)
    );

    generateHr(doc, position + 25);
  }

  const totalPosition = invoiceTableTop + (i + 1) * 35;
  globalPosition = totalPosition + 50;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    totalPosition,
    "",
    "",
    "TOTAL",
    "",
    formatCurrency(invoice.total)
  );

  // const paidToDatePosition = subtotalPosition + 20;
  // generateTableRow(
  //   doc,
  //   paidToDatePosition,
  //   "",
  //   "",
  //   "Paid To Date",
  //   "",
  //   formatCurrency(invoice.paid)
  // );

  // const duePosition = paidToDatePosition + 25;
  // doc.font("Helvetica-Bold");
  // generateTableRow(
  //   doc,
  //   duePosition,
  //   "",
  //   "",
  //   "Balance Due",
  //   "",
  //   formatCurrency(invoice.subtotal - invoice.paid)
  // );
  doc.font("Helvetica");
}

function generateExtraInformation(doc){
  doc.font("Helvetica");
  doc
  .fontSize(11)
  .text("FORMA DE PAGO: CHEQUE, CONTADO O TRANSFERENCIA",50, globalPosition)
  .text("ENTREGA 5 DIA DESPUÉS DE RECIBIDO EL 50% DE ANTICIPO, 50% CONTRA")
  .text("ENTREGA PROFORMA VALIDA POR 15 DÍAS");

  doc.font("Helvetica-Bold");
  doc
  .fontSize(11)
  .text("")
  .text("HACEMOS ENVÍO POR TRANSCARGO", 50)
  .text("ENVÍO BUS INTER LOCAL")
  .text("COSTO ADICIONAL")
  .text("NOTA: SOMOS CUTA FIJA",{underline:true});

  globalPosition+=100;
}

function generateFooter(doc) {
  doc
    .fontSize(8)
    .fillColor("red")
    .text(
      "Telefono: 8264 - 4263",
      50,
      globalPosition,
      { align: "center", width: 500}
    )
    .text(
      "email: laboratorioorvel@gmail.com",{align:"center"}
    );
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 170, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(number) {
  return "C$" + (number).toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

module.exports = {
  createInvoice
};