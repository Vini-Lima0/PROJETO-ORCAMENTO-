import React, { useState } from 'react';
import { Card, FormField, Input, Btn } from './ui';
import { loadData, saveData } from '../data';

export interface ConfigEmpresa {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
}

const defaultConfig: ConfigEmpresa = {
  nome: 'OpSuite Empresa',
  email: '',
  telefone: '',
  endereco: '',
};

export function loadConfig(): ConfigEmpresa {
  return loadData('opsuite_config', defaultConfig);
}

export default function Configuracoes() {
  const [form, setForm] = useState<ConfigEmpresa>(() => loadConfig());
  const [salvo, setSalvo] = useState(false);

  const handleSalvar = () => {
    saveData('opsuite_config', form);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
  };

  const field = (key: keyof ConfigEmpresa) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(p => ({ ...p, [key]: e.target.value }));
      setSalvo(false);
    },
  });

  return (
    <div style={{ maxWidth: 600 }}>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 18 }}>
          Dados da empresa
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FormField label="Nome da empresa">
            <Input {...field('nome')} placeholder="Ex: Minha Empresa Ltda" />
          </FormField>
          <FormField label="E-mail de contato">
            <Input {...field('email')} type="email" placeholder="contato@empresa.com.br" />
          </FormField>
          <FormField label="Telefone">
            <Input {...field('telefone')} placeholder="(11) 99999-9999" />
          </FormField>
          <FormField label="Endereço">
            <Input {...field('endereco')} placeholder="Rua, número, cidade/UF" />
          </FormField>
        </div>
      </Card>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Btn variant="primary" onClick={handleSalvar}>Salvar configurações</Btn>
        {salvo && (
          <span style={{ fontSize: 13, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20,6 9,17 4,12" />
            </svg>
            Salvo com sucesso
          </span>
        )}
      </div>
    </div>
  );
}
