import React, { useMemo } from 'react';
import { Orcamento } from '../types';
import { StatCard, Card, CardHeader, StatusBadge, fmtMoeda } from './ui';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, getMonth, getYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const MONTH_NAMES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

interface Props {
  orcamentos: Orcamento[];
  onVerOrcamentos: () => void;
  onEditar: (o: Orcamento) => void;
}

export default function Dashboard({ orcamentos, onVerOrcamentos, onEditar }: Props) {
  const stats = useMemo(() => {
    const aprovados = orcamentos.filter(o => o.status === 'aprovado');
    const pendentes = orcamentos.filter(o => o.status === 'aguardando' || o.status === 'enviado');
    const faturamento = aprovados.reduce((s, o) => s + o.total, 0);
    const ticketMedio = aprovados.length ? faturamento / aprovados.length : 0;
    return { total: orcamentos.length, aprovados: aprovados.length, pendentes: pendentes.length, faturamento, ticketMedio };
  }, [orcamentos]);

  const monthData = useMemo(() => {
    const currentYear = getYear(new Date());
    const map: Record<number, { emitido: number; aprovado: number }> = {};
    orcamentos.forEach(o => {
      const d = new Date(o.criadoEm + 'T12:00:00');
      if (getYear(d) !== currentYear) return;
      const m = getMonth(d);
      if (!map[m]) map[m] = { emitido: 0, aprovado: 0 };
      map[m].emitido += o.total;
      if (o.status === 'aprovado') map[m].aprovado += o.total;
    });
    const months = Object.keys(map).map(Number).sort((a, b) => a - b);
    return months.map(m => ({ mes: MONTH_NAMES[m], emitido: map[m].emitido, aprovado: map[m].aprovado }));
  }, [orcamentos]);

  const recentes = orcamentos.slice(0, 6);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 22 }}>
        <StatCard label="Faturamento do mês" value={fmtMoeda(stats.faturamento)} badge="↑ 18%" iconBg="var(--blue-bg)"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 9h4.5a1.5 1.5 0 010 3H9m0 0h5.5a1.5 1.5 0 010 3H9"/></svg>} />
        <StatCard label="Orçamentos gerados" value={String(stats.total)} badge="↑ 7%" iconBg="var(--green-bg)"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>} />
        <StatCard label="Aguardando resposta" value={String(stats.pendentes)} badge="↓ 3%" iconBg="var(--amber-bg)"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>} />
        <StatCard label="Aprovados" value={String(stats.aprovados)} badge="↑ 24%" iconBg="var(--teal-bg)"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2"><polyline points="20,6 9,17 4,12"/></svg>} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card>
          <CardHeader title="Receita mensal 2026" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthData} barGap={4} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text3)' }} axisLine={false} tickLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => fmtMoeda(Number(v))} contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }} />
              <Bar dataKey="emitido" fill="var(--surface3)" radius={[3,3,0,0]} name="Emitido" />
              <Bar dataKey="aprovado" fill="var(--blue-mid)" radius={[3,3,0,0]} name="Aprovado" />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
            {[['var(--surface3)','Emitido'],['var(--blue-mid)','Aprovado']].map(([c,l])=>(
              <div key={l} style={{ display:'flex',alignItems:'center',gap:5,fontSize:11.5,color:'var(--text2)' }}>
                <div style={{ width:8,height:8,borderRadius:'50%',background:c }} />{l}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Taxa de conversão" />
          {[
            { label: 'Aprovados', pct: stats.total ? Math.round(stats.aprovados/stats.total*100) : 0, color: 'var(--green)' },
            { label: 'Pendentes', pct: stats.total ? Math.round(stats.pendentes/stats.total*100) : 0, color: 'var(--amber)' },
            { label: 'Recusados', pct: stats.total ? Math.round(orcamentos.filter(o=>o.status==='recusado').length/stats.total*100) : 0, color: 'var(--red)' },
          ].map(r => (
            <div key={r.label} style={{ display:'flex',alignItems:'center',marginBottom:14 }}>
              <span style={{ fontSize:12.5,color:'var(--text2)',width:80,flexShrink:0 }}>{r.label}</span>
              <div style={{ flex:1,height:6,background:'var(--surface2)',borderRadius:3,margin:'0 12px' }}>
                <div style={{ width:`${r.pct}%`,height:'100%',borderRadius:3,background:r.color,transition:'width .4s' }} />
              </div>
              <span style={{ fontSize:12.5,fontWeight:500,minWidth:32,textAlign:'right' }}>{r.pct}%</span>
            </div>
          ))}
          <div style={{ borderTop:'1px solid var(--border)',marginTop:4,paddingTop:14 }}>
            <div style={{ fontSize:11,color:'var(--text3)',marginBottom:5 }}>Ticket médio aprovados</div>
            <div style={{ fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:700 }}>{fmtMoeda(stats.ticketMedio)}</div>
          </div>
        </Card>
      </div>

      <Card style={{ padding: 0 }}>
        <div style={{ padding: '18px 20px 14px', display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <span style={{ fontFamily:"'Syne',sans-serif",fontSize:14.5,fontWeight:600 }}>Últimos orçamentos</span>
          <button onClick={onVerOrcamentos} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--blue)',fontSize:13,fontWeight:500 }}>Ver todos →</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width:'100%',borderCollapse:'collapse' }}>
            <thead>
              <tr>{['NÚMERO','CLIENTE','VALOR','DATA','VALIDADE','STATUS',''].map(h=>(
                <th key={h} style={{ textAlign:'left',fontSize:11,fontWeight:500,color:'var(--text3)',letterSpacing:'0.7px',padding:'0 14px 10px',borderBottom:'1px solid var(--border)' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {recentes.map(o => (
                <tr key={o.id} style={{ cursor:'pointer' }} onMouseEnter={e=>(e.currentTarget.style.background='var(--surface2)')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                  <td style={{ padding:'11px 14px',fontWeight:500,color:'var(--blue)',fontSize:13 }}>#{o.numero}</td>
                  <td style={{ padding:'11px 14px',fontSize:13 }}>{o.clienteNome}</td>
                  <td style={{ padding:'11px 14px',fontSize:13,fontWeight:500 }}>{fmtMoeda(o.total)}</td>
                  <td style={{ padding:'11px 14px',fontSize:12.5,color:'var(--text2)' }}>{format(new Date(o.criadoEm+'T12:00:00'),'dd/MM',{locale:ptBR})}</td>
                  <td style={{ padding:'11px 14px',fontSize:12.5,color:'var(--text2)' }}>{format(new Date(o.validade+'T12:00:00'),'dd/MM',{locale:ptBR})}</td>
                  <td style={{ padding:'11px 14px' }}><StatusBadge status={o.status} /></td>
                  <td style={{ padding:'11px 14px' }}>
                    <button onClick={() => onEditar(o)} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--text3)',fontSize:18 }}>⋯</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
