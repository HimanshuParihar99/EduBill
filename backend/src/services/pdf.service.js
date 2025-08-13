
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";


export const generateReceipt = async (student, fee) => {
  if (!student || !fee) {
    throw new Error("Student and fee data are required to generate a receipt");
  }
  return new Promise((resolve, reject) => {
    try {
      const receiptsDir = path.join(process.cwd(), "receipts");
      if (!fs.existsSync(receiptsDir)) {
        fs.mkdirSync(receiptsDir, { recursive: true });
      }
      const safeName = (student.name || "student").replace(/[^a-zA-Z0-9_]/g, "_");
      const fileName = `${safeName}_receipt_${Date.now()}.pdf`;
      const filePath = path.join(receiptsDir, fileName);

      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      doc.fontSize(20).text("Student Fee Receipt", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Name: ${student.name}`);
      doc.text(`Class: ${student.class || "-"}`);
      doc.text(`Roll No: ${student.rollNo || "-"}`);
      doc.text(`Amount Paid: ₹${fee.amount}`);
      doc.text(`Payment Date: ${new Date().toLocaleString()}`);
      doc.text(`Payment ID: ${fee.paymentId || "-"}`);
      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", (err) => {
        console.error("PDF stream error:", err);
        reject(new Error("Failed to write PDF receipt"));
      });
    } catch (err) {
      console.error("PDF generation error:", err);
      reject(new Error("Failed to generate PDF receipt"));
    }
  });
};
