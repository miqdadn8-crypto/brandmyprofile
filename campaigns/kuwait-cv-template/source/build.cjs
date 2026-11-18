// Builds the Kuwait CV Template Pack: one .docx template per role (bracketed) and one PDF per role
// (fictional filled example), into the output directory given as argv[2].
const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, BorderStyle, ShadingType, AlignmentType, LevelFormat, TabStopType } = require('docx');
const { chromium } = require('playwright');
const { NOTE, roles } = require('./templates.cjs');

const out = process.argv[2];
fs.mkdirSync(out, { recursive: true });
const FONT = 'Calibri';

function docxFor(cv, withNote) {
  const kids = [];
  if (withNote) {
    kids.push(new Paragraph({
      children: [new TextRun({ text: NOTE, size: 18, font: FONT, color: '1F4E5A' })],
      shading: { type: ShadingType.CLEAR, color: 'auto', fill: 'E6F2F3' },
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: '7FB3BA' }, bottom: { style: BorderStyle.SINGLE, size: 4, color: '7FB3BA' }, left: { style: BorderStyle.SINGLE, size: 4, color: '7FB3BA' }, right: { style: BorderStyle.SINGLE, size: 4, color: '7FB3BA' } },
      spacing: { after: 240 },
    }));
  }
  kids.push(new Paragraph({ children: [new TextRun({ text: cv.name, bold: true, size: 36, font: FONT })], spacing: { after: 40 } }));
  kids.push(new Paragraph({ children: [new TextRun({ text: cv.role, size: 24, font: FONT })], spacing: { after: 60 } }));
  kids.push(new Paragraph({ children: [new TextRun({ text: cv.contact, size: 20, font: FONT })] }));
  kids.push(new Paragraph({ children: [new TextRun({ text: cv.details, size: 20, font: FONT })], spacing: { after: 120 } }));
  for (const [title, items] of cv.sections) {
    kids.push(new Paragraph({
      children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 22, font: FONT })],
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '444444', space: 2 } },
      spacing: { before: 200, after: 80 },
    }));
    for (const it of items) {
      if (it.p) kids.push(new Paragraph({ children: [new TextRun({ text: it.p, size: 21, font: FONT })], spacing: { after: 60 } }));
      if (it.b) kids.push(new Paragraph({ numbering: { reference: 'bul', level: 0 }, children: [new TextRun({ text: it.b, size: 21, font: FONT })], spacing: { after: 40 } }));
      if (it.role) kids.push(new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: 9600 }],
        children: [new TextRun({ text: it.role.title, bold: true, size: 21, font: FONT }), new TextRun({ text: ` · ${it.role.org}`, size: 21, font: FONT }), new TextRun({ text: `\t${it.role.dates}`, size: 21, font: FONT })],
        spacing: { before: 100, after: 40 },
      }));
    }
  }
  return new Document({
    creator: 'BrandMyProfile', title: 'Kuwait CV template',
    numbering: { config: [{ reference: 'bul', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 260 } } } }] }] },
    sections: [{ properties: { page: { margin: { top: 900, bottom: 900, left: 1000, right: 1000 } } }, children: kids }],
  });
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
function htmlFor(cv, label) {
  const sec = cv.sections.map(([t, items]) => `<h2>${esc(t)}</h2>` + items.map((it) =>
    it.p ? `<p>${esc(it.p)}</p>` : it.b ? `<ul><li>${esc(it.b)}</li></ul>` : `<div class="role"><span><b>${esc(it.role.title)}</b> · ${esc(it.role.org)}</span><span>${esc(it.role.dates)}</span></div>`).join('')).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @page{size:A4;margin:16mm 17mm}body{font-family:Calibri,Carlito,Arial,sans-serif;font-size:10.5pt;color:#111;line-height:1.35}
  .flag{font-size:8.5pt;color:#7a3b00;background:#fff4e5;border:1px solid #f0c48a;padding:5px 8px;margin-bottom:10px}
  h1{font-size:18pt;margin:0 0 2px}.r{font-size:12pt;margin:0 0 4px}.c{margin:0}.d{margin:0 0 8px}
  h2{font-size:11pt;text-transform:uppercase;border-bottom:1px solid #444;margin:12px 0 5px;padding-bottom:2px}
  p{margin:0 0 4px}ul{margin:0 0 2px;padding-left:18px}li{margin:0 0 2px}.role{display:flex;justify-content:space-between;margin:7px 0 3px}
  </style></head><body><div class="flag">FICTIONAL EXAMPLE - ${esc(label)}: shows how a finished Kuwait CV reads. Not a real candidate; employers and numbers are illustrative. Template and free CV review: brandmyprofile.com/resources/kuwait-cv-template</div>
  <h1>${esc(cv.name)}</h1><p class="r">${esc(cv.role)}</p><p class="c">${esc(cv.contact)}</p><p class="d">${esc(cv.details)}</p>${sec}</body></html>`;
}

(async () => {
  const browser = await chromium.launch();
  for (const [key, r] of Object.entries(roles)) {
    const buf = await Packer.toBuffer(docxFor(r.template, true));
    fs.writeFileSync(path.join(out, `kuwait-cv-template-${key}.docx`), buf);
    const page = await browser.newPage();
    await page.setContent(htmlFor(r.example, r.label), { waitUntil: 'load' });
    await page.pdf({ path: path.join(out, `kuwait-cv-example-${key}.pdf`), format: 'A4', printBackground: true });
    await page.close();
  }
  await browser.close();
  for (const f of fs.readdirSync(out)) console.log(f, fs.statSync(path.join(out, f)).size);
})();
