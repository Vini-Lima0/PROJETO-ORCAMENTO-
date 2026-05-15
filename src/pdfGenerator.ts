import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Orcamento, Cliente } from './types';
import { ConfigEmpresa } from './components/Configuracoes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const fmtVal = (v: number) =>
  v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtData = (s: string) =>
  format(new Date(s + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR });

const defaultConfig: ConfigEmpresa = {
  nome: 'Empresa', razaoSocial: '', cnpj: '', ie: '',
  email: '', telefone: '', endereco: '', logo: '',
};

export function gerarPDF(orc: Orcamento, config: ConfigEmpresa = defaultConfig, cliente?: Cliente): string | undefined {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });