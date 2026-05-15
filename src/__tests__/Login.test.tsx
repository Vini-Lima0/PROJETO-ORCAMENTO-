import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Login from '../components/Login';
import { Usuario } from '../types';

const usuarios: Usuario[] = [
  { id: 'u1', nome: 'Admin Teste', email: 'admin@test.com', senha: 'senha123', role: 'admin', ativo: true, criadoEm: '2026-01-01' },
  { id: 'u2', nome: 'Inativo',    email: 'inativo@test.com', senha: 'senha123', role: 'operacional', ativo: false, criadoEm: '2026-01-01' },
];

const emailInput = () => screen.getByPlaceholderText('seu@email.com');
const senhaInput = () => screen.getByPlaceholderText('••••••••');
const btnEntrar  = () => screen.getByRole('button', { name: 'Entrar' });

describe('Login', () => {
  it('renderiza tela de login', () => {
    render(<Login usuarios={usuarios} onLogin={jest.fn()} />);
    expect(screen.getByText('OpSuite')).toBeInTheDocument();
    expect(screen.getByText('Entrar na plataforma')).toBeInTheDocument();
    expect(emailInput()).toBeInTheDocument();
    expect(senhaInput()).toBeInTheDocument();
  });

  it('exibe erro ao submeter sem preencher campos', () => {
    render(<Login usuarios={usuarios} onLogin={jest.fn()} />);
    fireEvent.click(btnEntrar());
    expect(screen.getByText('Preencha e-mail e senha.')).toBeInTheDocument();
  });

  it('exibe erro para e-mail desconhecido', () => {
    render(<Login usuarios={usuarios} onLogin={jest.fn()} />);
    fireEvent.change(emailInput(), { target: { value: 'naoexiste@test.com' } });
    fireEvent.change(senhaInput(), { target: { value: 'qualquer' } });
    fireEvent.click(btnEntrar());
    expect(screen.getByText('E-mail não encontrado.')).toBeInTheDocument();
  });

  it('exibe erro para senha incorreta', () => {
    render(<Login usuarios={usuarios} onLogin={jest.fn()} />);
    fireEvent.change(emailInput(), { target: { value: 'admin@test.com' } });
    fireEvent.change(senhaInput(), { target: { value: 'errada' } });
    fireEvent.click(btnEntrar());
    expect(screen.getByText('Senha incorreta.')).toBeInTheDocument();
  });

  it('exibe erro para usuário inativo', () => {
    render(<Login usuarios={usuarios} onLogin={jest.fn()} />);
    fireEvent.change(emailInput(), { target: { value: 'inativo@test.com' } });
    fireEvent.change(senhaInput(), { target: { value: 'senha123' } });
    fireEvent.click(btnEntrar());
    expect(screen.getByText('Usuário inativo. Contate o administrador.')).toBeInTheDocument();
  });

  it('chama onLogin com o usuário correto após credenciais válidas', () => {
    jest.useFakeTimers();
    const onLogin = jest.fn();
    render(<Login usuarios={usuarios} onLogin={onLogin} />);
    fireEvent.change(emailInput(), { target: { value: 'admin@test.com' } });
    fireEvent.change(senhaInput(), { target: { value: 'senha123' } });
    fireEvent.click(btnEntrar());
    expect(screen.getByText('Entrando...')).toBeInTheDocument();
    act(() => { jest.runAllTimers(); });
    expect(onLogin).toHaveBeenCalledWith(usuarios[0]);
    jest.useRealTimers();
  });

  it('login é case-insensitive para o e-mail', () => {
    jest.useFakeTimers();
    const onLogin = jest.fn();
    render(<Login usuarios={usuarios} onLogin={onLogin} />);
    fireEvent.change(emailInput(), { target: { value: 'ADMIN@TEST.COM' } });
    fireEvent.change(senhaInput(), { target: { value: 'senha123' } });
    fireEvent.click(btnEntrar());
    act(() => { jest.runAllTimers(); });
    expect(onLogin).toHaveBeenCalledWith(usuarios[0]);
    jest.useRealTimers();
  });
});
