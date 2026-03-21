const PDFDocument = require('pdfkit');

const escapeCSV = (val) => {
  if (val == null) return '';
  const str = String(val);
  return str.includes(',') || str.includes('"') || str.includes('\n')
    ? `"${str.replace(/"/g, '""')}"`
    : str;
};

exports.generateCSV = (transactions) => {
  const header = 'Date,Type,Category,Amount,Description,Payment Source';
  const rows = transactions.map((t) =>
    [
      escapeCSV(t.transaction_date?.toISOString?.().split('T')[0] ?? t.transaction_date),
      escapeCSV(t.type),
      escapeCSV(t.category_name),
      escapeCSV(t.amount),
      escapeCSV(t.description),
      escapeCSV(t.payment_source),
    ].join(',')
  );
  return [header, ...rows].join('\n');
};

exports.generatePDF = (transactions) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Title
    doc.fontSize(18).font('Helvetica-Bold').text('Transaction Report', { align: 'center' });
    doc.moveDown(0.5);

    // Summary
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + parseFloat(t.amount), 0);
    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + parseFloat(t.amount), 0);

    doc.fontSize(10).font('Helvetica');
    doc.text(`Total Records: ${transactions.length}   |   Income: ${totalIncome.toFixed(2)}   |   Expense: ${totalExpense.toFixed(2)}`, { align: 'center' });
    doc.moveDown(1);

    // Table header
    const cols = { date: 40, type: 120, category: 190, amount: 300, source: 380, desc: 450 };
    const drawRow = (date, type, category, amount, source, desc, bold = false) => {
      doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(9);
      doc.text(date, cols.date, doc.y, { continued: true, width: 75 });
      doc.text(type, cols.type, doc.y, { continued: true, width: 65 });
      doc.text(category, cols.category, doc.y, { continued: true, width: 105 });
      doc.text(amount, cols.amount, doc.y, { continued: true, width: 75 });
      doc.text(source, cols.source, doc.y, { continued: true, width: 65 });
      doc.text(desc, cols.desc, doc.y, { width: 100 });
    };

    drawRow('Date', 'Type', 'Category', 'Amount', 'Source', 'Description', true);
    doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.3);

    for (const t of transactions) {
      const date = t.transaction_date?.toISOString?.().split('T')[0] ?? String(t.transaction_date);
      drawRow(date, t.type, t.category_name ?? '', String(t.amount), t.payment_source ?? '', t.description ?? '');
      doc.moveDown(0.2);
      if (doc.y > 750) doc.addPage();
    }

    doc.end();
  });
};
