"use client";

import { useState } from "react";
import Card from "~/components/Card";
import Button from "~/components/Button";
import Input from "~/components/Input";

interface MetaGasto {
  id: string;
  categoria: string;
  valorLimite: number;
  valorGasto: number;
  mes: string;
}

interface MetaOrcamento {
  id: string;
  nome: string;
  valorAlvo: number;
  valorAtual: number;
  dataInicio: string;
  dataFim: string;
}

export default function Metas() {
  const [abaSelecionada, setAbaSelecionada] = useState<"gastos" | "orcamento">(
    "gastos"
  );
  const [modalGastoAberto, setModalGastoAberto] = useState(false);
  const [modalOrcamentoAberto, setModalOrcamentoAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [itemParaExcluir, setItemParaExcluir] = useState<{
    tipo: "gasto" | "orcamento";
    id: string;
  } | null>(null);

  const [metasGastos, setMetasGastos] = useState<MetaGasto[]>([
    {
      id: "1",
      categoria: "Alimentação",
      valorLimite: 800,
      valorGasto: 528.5,
      mes: "2025-11",
    },
    {
      id: "2",
      categoria: "Transporte",
      valorLimite: 400,
      valorGasto: 185.0,
      mes: "2025-11",
    },
    {
      id: "3",
      categoria: "Entretenimento",
      valorLimite: 300,
      valorGasto: 255.9,
      mes: "2025-11",
    },
    {
      id: "4",
      categoria: "Saúde",
      valorLimite: 500,
      valorGasto: 150.0,
      mes: "2025-11",
    },
  ]);

  const [metasOrcamento, setMetasOrcamento] = useState<MetaOrcamento[]>([
    {
      id: "1",
      nome: "Fundo de Emergência",
      valorAlvo: 10000,
      valorAtual: 4500,
      dataInicio: "2025-01-01",
      dataFim: "2025-12-31",
    },
    {
      id: "2",
      nome: "Viagem 2026",
      valorAlvo: 5000,
      valorAtual: 1200,
      dataInicio: "2025-01-01",
      dataFim: "2026-06-30",
    },
    {
      id: "3",
      nome: "Novo Computador",
      valorAlvo: 3500,
      valorAtual: 2800,
      dataInicio: "2025-09-01",
      dataFim: "2025-12-31",
    },
  ]);

  const [gastoEditando, setGastoEditando] = useState<MetaGasto | null>(null);
  const [orcamentoEditando, setOrcamentoEditando] =
    useState<MetaOrcamento | null>(null);

  const [formGasto, setFormGasto] = useState({
    categoria: "",
    valorLimite: "",
    valorGasto: "",
    mes: new Date().toISOString().slice(0, 7),
  });

  const [formOrcamento, setFormOrcamento] = useState({
    nome: "",
    valorAlvo: "",
    valorAtual: "",
    dataInicio: new Date().toISOString().split("T")[0],
    dataFim: "",
  });

  const categorias = [
    "Alimentação",
    "Transporte",
    "Moradia",
    "Saúde",
    "Educação",
    "Entretenimento",
    "Compras",
    "Contas",
    "Outros",
  ];

  // Funções Meta de Gasto
  const abrirModalGasto = (meta?: MetaGasto) => {
    if (meta) {
      setGastoEditando(meta);
      setFormGasto({
        categoria: meta.categoria,
        valorLimite: meta.valorLimite.toString(),
        valorGasto: meta.valorGasto.toString(),
        mes: meta.mes,
      });
    } else {
      setGastoEditando(null);
      setFormGasto({
        categoria: "",
        valorLimite: "",
        valorGasto: "0",
        mes: new Date().toISOString().slice(0, 7),
      });
    }
    setModalGastoAberto(true);
  };

  const handleSubmitGasto = (e: React.FormEvent) => {
    e.preventDefault();

    if (gastoEditando) {
      setMetasGastos(
        metasGastos.map((m) =>
          m.id === gastoEditando.id
            ? {
                ...m,
                categoria: formGasto.categoria,
                valorLimite: parseFloat(formGasto.valorLimite),
                valorGasto: parseFloat(formGasto.valorGasto),
                mes: formGasto.mes,
              }
            : m
        )
      );
    } else {
      const novaMeta: MetaGasto = {
        id: Date.now().toString(),
        categoria: formGasto.categoria,
        valorLimite: parseFloat(formGasto.valorLimite),
        valorGasto: parseFloat(formGasto.valorGasto),
        mes: formGasto.mes,
      };
      setMetasGastos([...metasGastos, novaMeta]);
    }

    setModalGastoAberto(false);
  };

  // Funções Meta de Orçamento
  const abrirModalOrcamento = (meta?: MetaOrcamento) => {
    if (meta) {
      setOrcamentoEditando(meta);
      setFormOrcamento({
        nome: meta.nome,
        valorAlvo: meta.valorAlvo.toString(),
        valorAtual: meta.valorAtual.toString(),
        dataInicio: meta.dataInicio,
        dataFim: meta.dataFim,
      });
    } else {
      setOrcamentoEditando(null);
      setFormOrcamento({
        nome: "",
        valorAlvo: "",
        valorAtual: "0",
        dataInicio: new Date().toISOString().split("T")[0],
        dataFim: "",
      });
    }
    setModalOrcamentoAberto(true);
  };

  const handleSubmitOrcamento = (e: React.FormEvent) => {
    e.preventDefault();

    if (orcamentoEditando) {
      setMetasOrcamento(
        metasOrcamento.map((m) =>
          m.id === orcamentoEditando.id
            ? {
                ...m,
                nome: formOrcamento.nome,
                valorAlvo: parseFloat(formOrcamento.valorAlvo),
                valorAtual: parseFloat(formOrcamento.valorAtual),
                dataInicio: formOrcamento.dataInicio,
                dataFim: formOrcamento.dataFim,
              }
            : m
        )
      );
    } else {
      const novaMeta: MetaOrcamento = {
        id: Date.now().toString(),
        nome: formOrcamento.nome,
        valorAlvo: parseFloat(formOrcamento.valorAlvo),
        valorAtual: parseFloat(formOrcamento.valorAtual),
        dataInicio: formOrcamento.dataInicio,
        dataFim: formOrcamento.dataFim,
      };
      setMetasOrcamento([...metasOrcamento, novaMeta]);
    }

    setModalOrcamentoAberto(false);
  };

  // Funções de Exclusão
  const abrirModalExcluir = (tipo: "gasto" | "orcamento", id: string) => {
    setItemParaExcluir({ tipo, id });
    setModalExcluirAberto(true);
  };

  const confirmarExclusao = () => {
    if (itemParaExcluir) {
      if (itemParaExcluir.tipo === "gasto") {
        setMetasGastos(metasGastos.filter((m) => m.id !== itemParaExcluir.id));
      } else {
        setMetasOrcamento(
          metasOrcamento.filter((m) => m.id !== itemParaExcluir.id)
        );
      }
    }
    setModalExcluirAberto(false);
    setItemParaExcluir(null);
  };

  const formatarMes = (mes: string) => {
    const [ano, mesNum] = mes.split("-");
    const meses = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    return `${meses[parseInt(mesNum) - 1]}/${ano}`;
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
              <h1 className="text-xl font-bold text-neutral-900">
                Metas Financeiras
              </h1>
            </div>

            <Button
              onClick={() =>
                abaSelecionada === "gastos"
                  ? abrirModalGasto()
                  : abrirModalOrcamento()
              }
              variant="primary"
            >
              + Nova Meta
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Tabs */}
        <Card padding="none">
          <div className="grid grid-cols-2 gap-0">
            <button
              onClick={() => setAbaSelecionada("gastos")}
              className={`py-4 px-6 font-semibold transition-all border-b-2 ${
                abaSelecionada === "gastos"
                  ? "border-green-600 text-green-600 bg-green-50"
                  : "border-transparent text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              Metas de Gastos
            </button>
            <button
              onClick={() => setAbaSelecionada("orcamento")}
              className={`py-4 px-6 font-semibold transition-all border-b-2 ${
                abaSelecionada === "orcamento"
                  ? "border-green-600 text-green-600 bg-green-50"
                  : "border-transparent text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              Metas de Orçamento
            </button>
          </div>
        </Card>

        {/* Conteúdo - Metas de Gastos */}
        {abaSelecionada === "gastos" && (
          <div className="space-y-4">
            {metasGastos.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 text-neutral-300 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <p className="text-neutral-500 mb-4">
                    Nenhuma meta de gasto criada
                  </p>
                  <Button onClick={() => abrirModalGasto()} variant="primary">
                    Criar primeira meta
                  </Button>
                </div>
              </Card>
            ) : (
              metasGastos.map((meta) => {
                const percentual = (meta.valorGasto / meta.valorLimite) * 100;
                const isExcedido = percentual > 100;
                const isAlerta = percentual > 80 && percentual <= 100;

                return (
                  <Card key={meta.id} hover>
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-neutral-900">
                            {meta.categoria}
                          </h3>
                          <p className="text-sm text-neutral-500">
                            Período: {formatarMes(meta.mes)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => abrirModalGasto(meta)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => abrirModalExcluir("gasto", meta.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Valores */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-2xl font-bold ${
                            isExcedido
                              ? "text-red-600"
                              : isAlerta
                              ? "text-orange-600"
                              : "text-green-600"
                          }`}
                        >
                          R${" "}
                          {meta.valorGasto.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                        <span className="text-neutral-600 font-medium">
                          / R${" "}
                          {meta.valorLimite.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      {/* Barra de Progresso */}
                      <div>
                        <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isExcedido
                                ? "bg-red-500"
                                : isAlerta
                                ? "bg-orange-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${Math.min(percentual, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-neutral-600">
                            {percentual.toFixed(1)}% utilizado
                          </span>
                          {isExcedido && (
                            <span className="text-sm font-semibold text-red-600">
                              Excedido em R${" "}
                              {(
                                meta.valorGasto - meta.valorLimite
                              ).toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          )}
                          {!isExcedido && (
                            <span className="text-sm text-neutral-600">
                              Resta R${" "}
                              {(
                                meta.valorLimite - meta.valorGasto
                              ).toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* Conteúdo - Metas de Orçamento */}
        {abaSelecionada === "orcamento" && (
          <div className="space-y-4">
            {metasOrcamento.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 text-neutral-300 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-neutral-500 mb-4">
                    Nenhuma meta de orçamento criada
                  </p>
                  <Button
                    onClick={() => abrirModalOrcamento()}
                    variant="primary"
                  >
                    Criar primeira meta
                  </Button>
                </div>
              </Card>
            ) : (
              metasOrcamento.map((meta) => {
                const percentual = (meta.valorAtual / meta.valorAlvo) * 100;
                const concluida = percentual >= 100;

                return (
                  <Card key={meta.id} hover>
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-bold text-neutral-900">
                              {meta.nome}
                            </h3>
                            {concluida && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                ✓ Concluída
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-neutral-500">
                            {formatarData(meta.dataInicio)} até{" "}
                            {formatarData(meta.dataFim)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => abrirModalOrcamento(meta)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              abrirModalExcluir("orcamento", meta.id)
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Valores */}
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-green-600">
                          R${" "}
                          {meta.valorAtual.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                        <span className="text-neutral-600 font-medium">
                          / R${" "}
                          {meta.valorAlvo.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      {/* Barra de Progresso */}
                      <div>
                        <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-green-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(percentual, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-neutral-600">
                            {percentual.toFixed(1)}% do objetivo
                          </span>
                          {!concluida && (
                            <span className="text-sm text-neutral-600">
                              Faltam R${" "}
                              {(
                                meta.valorAlvo - meta.valorAtual
                              ).toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </main>

      {/* Modal Meta de Gasto */}
      {modalGastoAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">
                  {gastoEditando
                    ? "Editar Meta de Gasto"
                    : "Nova Meta de Gasto"}
                </h2>
                <button
                  onClick={() => setModalGastoAberto(false)}
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

              <form onSubmit={handleSubmitGasto} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Categoria <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formGasto.categoria}
                    onChange={(e) =>
                      setFormGasto({ ...formGasto, categoria: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Limite de Gasto <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">
                      R$
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={formGasto.valorLimite}
                      onChange={(e) =>
                        setFormGasto({
                          ...formGasto,
                          valorLimite: e.target.value,
                        })
                      }
                      placeholder="0,00"
                      required
                      className="w-full pl-12 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Valor Já Gasto
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">
                      R$
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={formGasto.valorGasto}
                      onChange={(e) =>
                        setFormGasto({
                          ...formGasto,
                          valorGasto: e.target.value,
                        })
                      }
                      placeholder="0,00"
                      className="w-full pl-12 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <Input
                  label="Mês de Referência"
                  type="month"
                  name="mes"
                  value={formGasto.mes}
                  onChange={(e) =>
                    setFormGasto({ ...formGasto, mes: e.target.value })
                  }
                  required
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => setModalGastoAberto(false)}
                    variant="secondary"
                    fullWidth
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" fullWidth>
                    {gastoEditando ? "Salvar" : "Criar Meta"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Meta de Orçamento */}
      {modalOrcamentoAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-md w-full my-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">
                  {orcamentoEditando
                    ? "Editar Meta de Orçamento"
                    : "Nova Meta de Orçamento"}
                </h2>
                <button
                  onClick={() => setModalOrcamentoAberto(false)}
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

              <form onSubmit={handleSubmitOrcamento} className="space-y-4">
                <Input
                  label="Nome da Meta"
                  name="nome"
                  value={formOrcamento.nome}
                  onChange={(e) =>
                    setFormOrcamento({ ...formOrcamento, nome: e.target.value })
                  }
                  placeholder="Ex: Viagem, Novo Carro..."
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Valor Alvo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">
                      R$
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={formOrcamento.valorAlvo}
                      onChange={(e) =>
                        setFormOrcamento({
                          ...formOrcamento,
                          valorAlvo: e.target.value,
                        })
                      }
                      placeholder="0,00"
                      required
                      className="w-full pl-12 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Valor Atual
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">
                      R$
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={formOrcamento.valorAtual}
                      onChange={(e) =>
                        setFormOrcamento({
                          ...formOrcamento,
                          valorAtual: e.target.value,
                        })
                      }
                      placeholder="0,00"
                      className="w-full pl-12 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Data Início"
                    type="date"
                    name="dataInicio"
                    value={formOrcamento.dataInicio}
                    onChange={(e) =>
                      setFormOrcamento({
                        ...formOrcamento,
                        dataInicio: e.target.value,
                      })
                    }
                    required
                  />

                  <Input
                    label="Data Fim"
                    type="date"
                    name="dataFim"
                    value={formOrcamento.dataFim}
                    onChange={(e) =>
                      setFormOrcamento({
                        ...formOrcamento,
                        dataFim: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => setModalOrcamentoAberto(false)}
                    variant="secondary"
                    fullWidth
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" fullWidth>
                    {orcamentoEditando ? "Salvar" : "Criar Meta"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {modalExcluirAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
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
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Excluir Meta?
              </h3>
              <p className="text-neutral-600 mb-6">
                Esta ação não pode ser desfeita. A meta será removida
                permanentemente.
              </p>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => setModalExcluirAberto(false)}
                  variant="secondary"
                  fullWidth
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={confirmarExclusao}
                  variant="danger"
                  fullWidth
                >
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
