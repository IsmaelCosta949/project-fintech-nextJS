"use client";

import { useEffect, useState } from "react";
import Card from "~/components/Card";
import Button from "~/components/Button";
import Input from "~/components/Input";
import { Transactions, TransactionsPost } from "../interfaces/transactions";
import { transactionService } from "../services/transactionService";
import { combineDateTime, formatDate, formatTime } from "~/utils/formatDate";
import { Wallets } from "../interfaces/wallets";
import { walletService } from "../services/walletService";

export default function Transacoes() {
  const [transacoes, setTransacoes] = useState<Transactions[]>([]);
  useEffect(() => {
    async function fetchTransactions() {
      try {
        const data = await transactionService.getTransactions();
        setTransacoes(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchTransactions();
  }, []);

  const [modalAberto, setModalAberto] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [transacaoParaExcluir, setTransacaoParaExcluir] = useState<
    number | null
  >(null);
  const [transacaoEditando, setTransacaoEditando] =
    useState<Transactions | null>(null);
  const [filtro, setFiltro] = useState<"todos" | "receita" | "despesa">(
    "todos"
  );
  const [ordenacao, setOrdenacao] = useState<"data" | "valor">("data");

  const [categorias, setCategorias] = useState<{
    receita: string[];
    despesa: string[];
  }>({ receita: [], despesa: [] });

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const wallets = await walletService.getWallets();
        const novasCategorias = {
          receita: [] as string[],
          despesa: [] as string[],
        };

        wallets.forEach((wallet) => {
          if (wallet.type === "receita") {
            novasCategorias.receita.push(wallet.name);
          } else if (wallet.type === "despesa") {
            novasCategorias.despesa.push(wallet.name);
          }
        });

        setCategorias(novasCategorias);
      } catch (err) {
        console.error("Erro ao buscar categorias:", err);
      }
    }

    fetchCategorias();
  }, []);

  const [formData, setFormData] = useState<{
    transactionId: number;
    descricao: string;
    valor: string;
    tipo: keyof typeof categorias | "";
    categoria: string;
    data: string;
    hora: string;
  }>({
    transactionId: 0,
    descricao: "",
    valor: "",
    tipo: "",
    categoria: "",
    data: new Date().toISOString().split("T")[0],
    hora: new Date().toTimeString().slice(0, 5),
  });

  const abrirModal = (transacao?: Transactions) => {
    if (transacao) {
      setTransacaoEditando(transacao);

      setFormData({
        transactionId: transacao.id,
        descricao: transacao.description,
        valor: Math.abs(transacao.value).toString(),
        tipo: transacao.type as "receita" | "despesa" | "",
        categoria: transacao.category,
        data: transacao.date,
        hora: transacao.hour,
      });
    } else {
      setTransacaoEditando(null);
      setFormData({
        transactionId: 0,
        descricao: "",
        valor: "",
        tipo: "despesa",
        categoria: "",
        data: new Date().toISOString().split("T")[0],
        hora: new Date().toTimeString().slice(0, 5),
      });
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setTransacaoEditando(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const valorNumerico =
      formData.tipo === "receita"
        ? parseFloat(formData.valor)
        : -parseFloat(formData.valor);

    if (transacaoEditando) {
      // Editar
      const wallets = await walletService.getWallets();
      const walletId = wallets.find((w) => w.name === formData.categoria);
      const editTransaction: TransactionsPost = {
        walletId: walletId?.walletId || 0,
        description: formData.descricao,
        type: formData.tipo,
        value: valorNumerico,
        transactionAt: combineDateTime(formData.data, formData.hora),
      };
      console.log(editTransaction, formData.transactionId);

      const response = await transactionService.editTransaction(
        editTransaction,
        formData.transactionId
      );
    } else {
      // Adicionar
      const wallets = await walletService.getWallets();
      const walletId = wallets.find((w) => w.name === formData.categoria);
      const newTransaction: TransactionsPost = {
        walletId: walletId?.walletId || 0,
        description: formData.descricao,
        type: formData.tipo,
        value: valorNumerico,
        transactionAt: combineDateTime(formData.data, formData.hora),
      };
      const response = await transactionService.postTransaction(newTransaction);
    }

    // fecharModal();
  };

  const abrirModalExcluir = (id: number) => {
    setTransacaoParaExcluir(id);
    setModalExcluir(true);
  };

  const confirmarExclusao = async () => {
    if (transacaoParaExcluir) {
      const response = await transactionService.deleteTransaction(
        transacaoParaExcluir
      );
    }
    setModalExcluir(false);
    setTransacaoParaExcluir(null);
  };

  const cancelarExclusao = () => {
    setModalExcluir(false);
    setTransacaoParaExcluir(null);
  };

  const transacoesFiltradas = transacoes
    .filter((t) => {
      if (filtro === "todos") return true;
      return t.type === filtro;
    })
    .sort((a, b) => {
      if (ordenacao === "data") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return Math.abs(b.value) - Math.abs(a.value);
    });

  const totalReceitas = transacoes
    .filter((t) => t.type === "receita")
    .reduce((acc, t) => acc + t.value, 0);
  const totalDespesas = transacoes
    .filter((t) => t.type === "despesa")
    .reduce((acc, t) => acc + Math.abs(t.value), 0);
  const saldo = totalReceitas - totalDespesas;

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
              <h1 className="text-xl font-bold text-neutral-900">Transações</h1>
            </div>

            <Button onClick={() => abrirModal()} variant="primary">
              + Nova Transação
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Filtros */}
        <Card>
          <div className="flex flex-col gap-4">
            {/* Resumo Compacto */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-semibold">
                  +R${" "}
                  {totalReceitas.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
                <span className="text-neutral-400">|</span>
                <span className="text-red-600 font-semibold">
                  -R${" "}
                  {totalDespesas.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
                <span className="text-neutral-400">|</span>
                <span className="text-neutral-900 font-bold">
                  Saldo: R${" "}
                  {saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Filtros e Ordenação */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFiltro("todos")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    filtro === "todos"
                      ? "bg-green-600 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFiltro("receita")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    filtro === "receita"
                      ? "bg-green-600 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  Receitas
                </button>
                <button
                  onClick={() => setFiltro("despesa")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    filtro === "despesa"
                      ? "bg-green-600 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  Despesas
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600 whitespace-nowrap">
                  Ordenar:
                </span>
                <select
                  value={ordenacao}
                  onChange={(e) =>
                    setOrdenacao(e.target.value as "data" | "valor")
                  }
                  className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm w-full sm:w-auto"
                >
                  <option value="data">Data</option>
                  <option value="valor">Valor</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Lista de Transações */}
        <Card>
          <h3 className="text-lg font-bold text-neutral-900 mb-4">
            {transacoesFiltradas.length} transações
          </h3>

          <div className="space-y-3">
            {transacoesFiltradas.length === 0 ? (
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
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p className="text-neutral-500">Nenhuma transação encontrada</p>
                <Button
                  onClick={() => abrirModal()}
                  variant="primary"
                  className="mt-4"
                >
                  Adicionar primeira transação
                </Button>
              </div>
            ) : (
              transacoesFiltradas.map((transacao) => (
                <div
                  key={transacao.id}
                  className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        transacao.type === "receita"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      <svg
                        className={`w-6 h-6 ${
                          transacao.type === "receita"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {transacao.type === "receita" ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 11l5-5m0 0l5 5m-5-5v12"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 13l-5 5m0 0l-5-5m5 5V6"
                          />
                        )}
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-neutral-900 truncate">
                        {transacao.description}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {transacao.category} • {formatarData(transacao.date)}{" "}
                        {formatTime(transacao.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span
                      className={`text-lg font-bold ${
                        transacao.type === "receita"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transacao.type === "receita" ? "+" : "-"}R${" "}
                      {Math.abs(transacao.value).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => abrirModal(transacao)}
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
                        onClick={() => abrirModalExcluir(transacao.id || 0)}
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
                </div>
              ))
            )}
          </div>
        </Card>
      </main>

      {/* Modal de Adicionar/Editar */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">
                  {transacaoEditando ? "Editar Transação" : "Nova Transação"}
                </h2>
                <button
                  onClick={fecharModal}
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

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tipo */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Tipo <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          tipo: "receita",
                          categoria: "",
                        })
                      }
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.tipo === "receita"
                          ? "border-green-600 bg-green-50"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <div className="text-3xl mb-2">📈</div>
                      <p className="font-semibold text-neutral-900">Receita</p>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          tipo: "despesa",
                          categoria: "",
                        })
                      }
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.tipo === "despesa"
                          ? "border-red-600 bg-red-50"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <div className="text-3xl mb-2">📉</div>
                      <p className="font-semibold text-neutral-900">Despesa</p>
                    </button>
                  </div>
                </div>

                <Input
                  label="Descrição"
                  name="descricao"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  placeholder="Ex: Salário, Supermercado..."
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Valor <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">
                      R$
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.valor}
                      onChange={(e) =>
                        setFormData({ ...formData, valor: e.target.value })
                      }
                      placeholder="0,00"
                      required
                      className="w-full pl-12 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Categoria <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) =>
                      setFormData({ ...formData, categoria: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="">Selecione uma categoria</option>

                    {formData.tipo &&
                      categorias[formData.tipo]?.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Data"
                    type="date"
                    name="data"
                    value={formData.data}
                    onChange={(e) => {
                      setFormData({ ...formData, data: e.target.value });
                    }}
                    required
                  />

                  <Input
                    label="Hora"
                    type="time"
                    name="hora"
                    value={formData.hora}
                    onChange={(e) => {
                      setFormData({ ...formData, hora: e.target.value });
                    }}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={fecharModal}
                    variant="secondary"
                    fullWidth
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" fullWidth>
                    {transacaoEditando ? "Salvar" : "Adicionar"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {modalExcluir && (
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
                Excluir Transação?
              </h3>
              <p className="text-neutral-600 mb-6">
                Esta ação não pode ser desfeita. A transação será removida
                permanentemente.
              </p>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={cancelarExclusao}
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
