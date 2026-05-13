import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Orcamento } from './types';
import { ConfigEmpresa } from './components/Configuracoes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const fmtMoeda = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const fmtData = (s: string) =>
  format(new Date(s + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR });

const statusLabel: Record<string, string> = {
  rascunho: 'RASCUNHO',
  enviado: 'ENVIADO',
  aprovado: 'APROVADO',
  recusado: 'RECUSADO',
  aguardando: 'AGUARDANDO',
};

const statusColor: Record<string, [number, number, number]> = {
  aprovado: [59, 109, 17],
  enviado: [24, 95, 165],
  aguardando: [186, 117, 23],
  recusado: [163, 45, 45],
  rascunho: [106, 103, 96],
};

const defaultConfig: ConfigEmpresa = { nome: 'OpSuite Empresa', email: '', telefone: '', endereco: '' };

export function gerarPDF(orc: Orcamento, config: ConfigEmpresa = defaultConfig) {
  const { nome: empresaNome, email, telefone, endereco } = config;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const M = 18;
  let y = 0;

  // Header block — altura dinâmica conforme presença de info extra
  const hasInfo = email || telefone || endereco;
  const headerH = hasInfo ? 50 : 42;
  doc.setFillColor(24, 23, 20);
  doc.rect(0, 0, W, headerH, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text(empresaNome, M, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(160, 157, 151);
  doc.text('ORÇAMENTO COMERCIAL', M, 25);

  if (hasInfo) {
    const infoParts = [email, telefone, endereco].filter(Boolean).join('  ·  ');
    doc.setFontSize(8);
    doc.text(infoParts, M, 33);
  }

  // Numero e status
  const sc = statusColor[orc.status] || [106, 103, 96];
  doc.setFillColor(...sc);
  doc.roundedRect(W - M - 36, 8, 36, 10, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text(statusLabel[orc.status] || orc.status.toUpperCase(), W - M - 18, 14, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(`#${orc.numero}`, W - M, 28, { align: 'right' });

  y = headerH + 10;

  // Info boxes
  const boxes = [
    { label: 'Cliente', value: orc.clienteNome },
    { label: 'Contato', value: orc.contato || '—' },
    { label: 'Emitido em', value: fmtData(orc.criadoEm) },
    { label: 'Válido até', value: fmtData(orc.validade) },
  ];
  const bw = (W - M * 2 - 12) / 4;
  boxes.forEach((b, i) => {
    const x = M + i * (bw + 4);
    doc.setFillColor(242, 240, 236);
    doc.roundedRect(x, y, bw, 18, 2, 2, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(106, 103, 96);
    doc.text(b.label.toUpperCase(), x + 5, y + 6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(24, 23, 20);
    doc.text(b.value, x + 5, y + 13);
  });

  y += 26;

  // Items table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(24, 23, 20);
  doc.text('Itens do Orçamento', M, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    margin: { left: M, right: M },
    head: [['DESCRIÇÃO', 'PERÍODO', 'QTD', 'VL. UNIT.', 'TOTAL']],
    body: orc.itens.map(it => [
      it.descricao,
      it.periodo || '—',
      String(it.quantidade),
      fmtMoeda(it.valorUnitario),
      fmtMoeda(it.quantidade * it.valorUnitario),
    ]),
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 4, textColor: [24, 23, 20] },
    headStyles: { fillColor: [24, 23, 20], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    alternateRowStyles: { fillColor: [247, 246, 243] },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 28 },
      2: { cellWidth: 14, halign: 'center' },
      3: { cellWidth: 28, halign: 'right' },
      4: { cellWidth: 28, halign: 'right', fontStyle: 'bold' },
    },
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  // Totals
  const totals: [string, string, boolean][] = [
    ['Subtotal', fmtMoeda(orc.subtotal), false],
    [`Desconto (${orc.desconto}%)`, `- ${fmtMoeda(orc.subtotal * orc.desconto / 100)}`, false],
    [`Impostos (${orc.impostos}%)`, `+ ${fmtMoeda(orc.subtotal * (1 - orc.desconto / 100) * orc.impostos / 100)}`, false],
    ['TOTAL', fmtMoeda(orc.total), true],
  ];

  const tw = 80;
  const tx = W - M - tw;
  totals.forEach(([label, val, grand]) => {
    if (grand) {
      doc.setFillColor(24, 23, 20);
      doc.roundedRect(tx - 4, y - 4, tw + 8, 12, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(label, tx + 2, y + 4);
      doc.text(val, W - M, y + 4, { align: 'right' });
      y += 16;
    } else {
      doc.setTextColor(106, 103, 96);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(label, tx + 2, y + 4);
      doc.setTextColor(24, 23, 20);
      doc.text(val, W - M, y + 4, { align: 'right' });
      y += 9;
    }
  });

  // Observações
  if (orc.observacoes) {
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const maxWidth = W - M * 2 - 10;
    const lines = doc.splitTextToSize(orc.observacoes, maxWidth) as string[];
    const lineH = 5;
    const boxH = 10 + lines.length * lineH;
    doc.setFillColor(242, 240, 236);
    doc.roundedRect(M, y, W - M * 2, boxH, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(106, 103, 96);
    doc.text('OBSERVAÇÕES', M + 5, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(24, 23, 20);
    lines.forEach((line, i) => {
      doc.text(line, M + 5, y + 13 + i * lineH);
    });
    y += boxH + 6;
  }

  // Footer
  const pageH = 297;
  doc.setFillColor(242, 240, 236);
  doc.rect(0, pageH - 16, W, 16, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(106, 103, 96);
  const footerLeft = [empresaNome, endereco].filter(Boolean).join(' · ');
  doc.text(`${footerLeft} · Gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, M, pageH - 6);
  doc.text('Orçamento não possui valor fiscal', W - M, pageH - 6, { align: 'right' });

  doc.save(`${orc.numero}.pdf`);
}
