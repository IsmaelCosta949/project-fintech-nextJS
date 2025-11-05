"use client";

import { useEffect, useState } from "react";
import Card from "~/components/Card";
import Button from "~/components/Button";
import Input from "~/components/Input";
import { useUser } from "../context/UserContext";

export default function Usuario() {
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [modalSairAberto, setModalSairAberto] = useState(false);
  const { user, setUser } = useUser();

  const [dadosUsuario, setDadosUsuario] = useState({
    nome: user?.nome,
    email: user?.email,
    cpf: user?.cpf,
    telefone: user?.telefone,
    dinheiroMensal: user?.dinheiroMensal,
    dataCadastro: user?.dataCadastro,
  });
  useEffect(() => {
    setDadosUsuario({
      nome: user?.nome,
      email: user?.email,
      cpf: user?.cpf,
      telefone: user?.telefone,
      dinheiroMensal: user?.dinheiroMensal,
      dataCadastro: user?.dataCadastro,
    });
  }, [user]);

  const [formData, setFormData] = useState({
    nome: dadosUsuario.nome,
    email: dadosUsuario.email,
    cpf: dadosUsuario.cpf,
    telefone: dadosUsuario.telefone,
    dinheiroMensal: dadosUsuario.dinheiroMensal?.toString(),
    senhaAtual: "",
    novaSenha: "",
    confirmarNovaSenha: "",
  });

  const abrirModalEditar = () => {
    setFormData({
      nome: dadosUsuario.nome,
      email: dadosUsuario.email,
      cpf: dadosUsuario.cpf,
      telefone: dadosUsuario.telefone,
      dinheiroMensal: dadosUsuario.dinheiroMensal?.toString(),
      senhaAtual: "",
      novaSenha: "",
      confirmarNovaSenha: "",
    });
    setModalEditarAberto(true);
  };

  const handleSubmitEdicao = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação de senha (se estiver mudando)
    if (formData.novaSenha) {
      if (formData.novaSenha !== formData.confirmarNovaSenha) {
        alert("As senhas não coincidem!");
        return;
      }
      if (!formData.senhaAtual) {
        alert("Digite sua senha atual para alterar a senha!");
        return;
      }
    }

    // Atualizar dados
    setDadosUsuario({
      ...dadosUsuario,
      nome: formData.nome,
      email: formData.email,
      cpf: formData.cpf,
      telefone: formData.telefone,
      dinheiroMensal: formData.dinheiroMensal
        ? parseFloat(formData.dinheiroMensal)
        : 0,
    });

    setModalEditarAberto(false);
    alert("Dados atualizados com sucesso!");
  };

  const handleSair = () => {
    // Redirecionar para login
    window.location.href = "/login";
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => (window.location.href = "/home")}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6 text-neutral-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-neutral-900">Meu Perfil</h1>
            </div>

            <button
              onClick={() => setModalSairAberto(true)}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="font-semibold hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Card do Perfil */}
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Avatar */}
            <div className="flex justify-center sm:justify-start">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    {dadosUsuario.nome
                      ? dadosUsuario.nome
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                      : "Nome não informado"}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border-2 border-green-600 rounded-full flex items-center justify-center hover:bg-green-50 transition-colors">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Informações */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-neutral-900 mb-1">
                {dadosUsuario.nome}
              </h2>
              <p className="text-neutral-600 mb-4">{dadosUsuario.email}</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  Membro desde{" "}
                  {dadosUsuario.dataCadastro
                    ? formatarData(dadosUsuario.dataCadastro)
                    : "Data de cadastro não encontrada"}
                </span>
              </div>
            </div>

            {/* Botão Editar */}
            <div>
              <Button onClick={abrirModalEditar} variant="outline">
                Editar Perfil
              </Button>
            </div>
          </div>
        </Card>

        {/* Informações Pessoais */}
        <Card>
          <h3 className="text-lg font-bold text-neutral-900 mb-4">
            Informações Pessoais
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-600 mb-1">Nome Completo</p>
              <p className="font-semibold text-neutral-900">
                {dadosUsuario.nome || "Nome não informado"}
              </p>
            </div>

            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-600 mb-1">E-mail</p>
              <p className="font-semibold text-neutral-900">
                {dadosUsuario.email || "Email não informado"}
              </p>
            </div>

            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-600 mb-1">CPF</p>
              <p className="font-semibold text-neutral-900">
                {dadosUsuario.cpf || "Cpf não informado"}
              </p>
            </div>

            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-600 mb-1">Telefone</p>
              <p className="font-semibold text-neutral-900">
                {dadosUsuario.telefone || "Telefone não informado"}
              </p>
            </div>
          </div>
        </Card>

        {/* Configurações Financeiras */}
        <Card>
          <h3 className="text-lg font-bold text-neutral-900 mb-4">
            Configurações Financeiras
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 mb-1">Dinheiro Mensal</p>
              <p className="text-2xl font-bold text-green-900">
                R${" "}
                {dadosUsuario.dinheiroMensal
                  ? dadosUsuario.dinheiroMensal.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })
                  : "Dinheiro mensal não informado"}
              </p>
            </div>

            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-600 mb-1">Moeda</p>
              <p className="font-semibold text-neutral-900">
                Real Brasileiro (BRL)
              </p>
            </div>
          </div>
        </Card>

        {/* Ações */}
        <Card>
          <h3 className="text-lg font-bold text-neutral-900 mb-4">Ações</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 rounded-lg transition-colors border border-neutral-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-neutral-900">
                    Alterar Senha
                  </p>
                  <p className="text-sm text-neutral-600">
                    Atualize sua senha de acesso
                  </p>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 rounded-lg transition-colors border border-neutral-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-neutral-900">Notificações</p>
                  <p className="text-sm text-neutral-600">
                    Configure alertas e lembretes
                  </p>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 rounded-lg transition-colors border border-neutral-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-neutral-900">Saiba Mais</p>
                  <p className="text-sm text-neutral-600">
                    Sobre o FinTech e recursos
                  </p>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </Card>

        {/* Zona de Perigo */}
        <Card className="border-2 border-red-200">
          <h3 className="text-lg font-bold text-red-600 mb-4">
            Zona de Perigo
          </h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 rounded-lg transition-colors border border-red-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-red-600">Excluir Conta</p>
                  <p className="text-sm text-neutral-600">
                    Deletar permanentemente sua conta
                  </p>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </Card>
      </main>

      {/* Modal de Editar Perfil */}
      {modalEditarAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full my-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">
                  Editar Perfil
                </h2>
                <button
                  onClick={() => setModalEditarAberto(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-neutral-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmitEdicao} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nome Completo"
                    name="nome"
                    value={formData.nome ? formData.nome : ""}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    required
                  />

                  <Input
                    label="E-mail"
                    type="email"
                    name="email"
                    value={formData.email ? formData.email : ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="CPF"
                    name="cpf"
                    value={formData.cpf ? formData.cpf : ""}
                    onChange={(e) =>
                      setFormData({ ...formData, cpf: e.target.value })
                    }
                    placeholder="000.000.000-00"
                  />

                  <Input
                    label="Telefone"
                    name="telefone"
                    value={formData.telefone ? formData.telefone : ""}
                    onChange={(e) =>
                      setFormData({ ...formData, telefone: e.target.value })
                    }
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Dinheiro Mensal <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">
                      R$
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.dinheiroMensal}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dinheiroMensal: e.target.value,
                        })
                      }
                      required
                      className="w-full pl-12 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-4 mt-4">
                  <h3 className="font-semibold text-neutral-900 mb-4">
                    Alterar Senha (Opcional)
                  </h3>

                  <div className="space-y-4">
                    <Input
                      label="Senha Atual"
                      type="password"
                      name="senhaAtual"
                      value={formData.senhaAtual}
                      onChange={(e) =>
                        setFormData({ ...formData, senhaAtual: e.target.value })
                      }
                      placeholder="••••••••"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Nova Senha"
                        type="password"
                        name="novaSenha"
                        value={formData.novaSenha}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            novaSenha: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                      />

                      <Input
                        label="Confirmar Nova Senha"
                        type="password"
                        name="confirmarNovaSenha"
                        value={formData.confirmarNovaSenha}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmarNovaSenha: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => setModalEditarAberto(false)}
                    variant="secondary"
                    fullWidth
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" fullWidth>
                    Salvar Alterações
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmar Saída */}
      {modalSairAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Sair da Conta?
              </h3>
              <p className="text-neutral-600 mb-6">
                Você será desconectado e redirecionado para a tela de login.
              </p>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => setModalSairAberto(false)}
                  variant="secondary"
                  fullWidth
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleSair}
                  variant="danger"
                  fullWidth
                >
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
