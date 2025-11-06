"use client";

import { useEffect, useState } from "react";
import Card from "~/components/Card";
import Button from "~/components/Button";
import { transactionService } from "../services/transactionService";
import { Transactions } from "../interfaces/transactions";
import { walletService } from "../services/walletService";
import { GoalBudget, GoalSpent } from "../interfaces/goals";
import { useUser } from "../context/UserContext";
import { formatDateTime } from "~/utils/formatDate";

export default function Home() {
  const [dinheiroMensal, setDinheiroMensal] = useState(0);
  const [saldoAtual, setSaldoAtual] = useState(0);
  const [totalDespesasMes, setTotalDespesasMes] = useState(0);
  const [transacoesRecentes, setTransacoesRecentes] = useState<Transactions[]>(
    []
  );
  const [todasTransacoes, setTodasTransacoes] = useState<Transactions[]>([]);
  const [metasGastos, setMetasGastos] = useState<GoalSpent[]>([]);
  const [metasOrcamento, setMetasOrcamento] = useState<GoalBudget[]>([]);
  const { user } = useUser();

  // Função para verificar se a transação é do mês atual
  const isCurrentMonth = (dateString: string) => {
    const transactionDate = new Date(dateString);
    const now = new Date();
    return (
      transactionDate.getMonth() === now.getMonth() &&
      transactionDate.getFullYear() === now.getFullYear()
    );
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Buscar todas as transações
        const data = await transactionService.getTransactions();
        setTodasTransacoes(data);

        // Pegar as 3 mais recentes
        setTransacoesRecentes(data.slice(0, 3));

        // Calcular total de despesas do mês atual
        const despesasMesAtual = data
          .filter((t) => t.type === "EXPENSE" && isCurrentMonth(t.date))
          .reduce((acc, t) => acc + Math.abs(t.value), 0);

        setTotalDespesasMes(despesasMesAtual);

        // Pegar salário mensal do localStorage (ou usar padrão de R$ 5000)
        const salarioMensalStr = localStorage.getItem("salarioMensal");
        const salarioMensal = salarioMensalStr
          ? parseFloat(salarioMensalStr)
          : 5000;
        setDinheiroMensal(salarioMensal);

        // Calcular saldo atual: Salário - Despesas do Mês
        setSaldoAtual(salarioMensal - despesasMesAtual);
      } catch (err) {
        console.error("Erro ao buscar transações:", err);
      }
    }

    async function fetchGoals() {
      try {
        const [gastos, orcamentos] = await Promise.all([
          walletService.getGoalSpent(),
          walletService.getGoalBudget(),
        ]);
        setMetasGastos(gastos);
        setMetasOrcamento(orcamentos);
      } catch (err) {
        console.error("Erro ao buscar metas:", err);
      }
    }

    fetchData();
    fetchGoals();
  }, [user]);

  // Calcular totais das transações RECENTES (últimas 3)
  const totalReceitas = transacoesRecentes
    .filter((t) => t.type === "BUDGET")
    .reduce((acc, t) => acc + Math.abs(t.value), 0);
  const totalDespesasRecentes = transacoesRecentes
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, t) => acc + Math.abs(t.value), 0);

  const percentualDinheiroMensal =
    dinheiroMensal > 0 ? (totalDespesasMes / dinheiroMensal) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
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
              </div>
              <h1 className="text-xl font-bold text-neutral-900">FinTech</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
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
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
              <button
                onClick={() => (window.location.href = "/usuario")}
                className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold hover:bg-green-700 transition-colors"
              >
                JD
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Saudação e Ação Rápida */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900">
              Olá, {user?.name}! 👋
            </h2>
            <p className="text-neutral-600 mt-1">
              Bem-vindo de volta ao seu painel financeiro
            </p>
          </div>
        </div>

        {/* Card de Dinheiro Mensal */}
        <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <p className="text-green-100 text-sm font-medium mb-2">
                Saldo Disponível Este Mês
              </p>
              <div className="flex items-baseline space-x-3 mb-4">
                <h3
                  className={`text-4xl sm:text-5xl font-bold ${
                    saldoAtual < 0 ? "text-red-200" : ""
                  }`}
                >
                  R${" "}
                  {saldoAtual.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </h3>
                <span className="text-green-200 text-xl">
                  de R${" "}
                  {dinheiroMensal.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              {/* Barra de progresso */}
              <div className="w-full bg-green-800/50 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(percentualDinheiroMensal, 100)}%`,
                  }}
                ></div>
              </div>
              <p className="text-green-100 text-sm mt-2">
                {percentualDinheiroMensal.toFixed(1)}% do salário mensal gasto
                {saldoAtual >= 0
                  ? ` • Restam R$ ${saldoAtual.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}`
                  : ` • Excedeu em R$ ${Math.abs(saldoAtual).toLocaleString(
                      "pt-BR",
                      { minimumFractionDigits: 2 }
                    )}`}
              </p>
            </div>

            <div className="flex sm:flex-col gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex-1 sm:flex-none">
                <p className="text-green-100 text-xs mb-1">Receitas</p>
                <p className="text-white text-xl font-bold">
                  +R${" "}
                  {totalReceitas.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex-1 sm:flex-none">
                <p className="text-green-100 text-xs mb-1">Despesas do Mês</p>
                <p className="text-white text-xl font-bold">
                  -R${" "}
                  {totalDespesasMes.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Prévia de Metas */}
        <Card
          hover
          className="cursor-pointer"
          onClick={() => (window.location.href = "/metas")}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-neutral-900">
                Metas Financeiras
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                Acompanhe suas metas de gastos e orçamento
              </p>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <span className="text-sm font-semibold">Ver todas</span>
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Resumo Metas de Gastos */}
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-900">
                    Metas de Gastos
                  </p>
                  <p className="text-xs text-orange-700">
                    {metasGastos.length} categorias
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {metasGastos.slice(0, 2).map((meta) => {
                  const percentual = (meta.spentValue / meta.limitValue) * 100;
                  return (
                    <div
                      key={meta.id}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-neutral-700">{meta.category}</span>
                      <span
                        className={`font-semibold ${
                          percentual > 80 ? "text-orange-600" : "text-green-600"
                        }`}
                      >
                        {percentual.toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
                {metasGastos.length > 2 && (
                  <p className="text-xs text-orange-700 font-medium">
                    +{metasGastos.length - 2} mais...
                  </p>
                )}
              </div>
            </div>

            {/* Resumo Metas de Orçamento */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
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
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Metas de Orçamento
                  </p>
                  <p className="text-xs text-blue-700">
                    {metasOrcamento.length} objetivos
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {metasOrcamento.slice(0, 2).map((meta) => {
                  const percentual =
                    (meta.currentValue / meta.targetValue) * 100;
                  return (
                    <div
                      key={meta.id}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-neutral-700 truncate">
                        {meta.name}
                      </span>
                      <span className="font-semibold text-blue-600">
                        {percentual.toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
                {metasOrcamento.length > 2 && (
                  <p className="text-xs text-blue-700 font-medium">
                    +{metasOrcamento.length - 2} mais...
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Transações Recentes (Prévia) */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-neutral-900">
              Transações Recentes
            </h3>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/transacoes")}
            >
              Ver todas
            </Button>
          </div>

          <div className="space-y-3">
            {transacoesRecentes.map((transacao) => (
              <div
                key={transacao.id}
                className="flex items-center justify-between p-4 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer border border-neutral-100"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      transacao.type === "BUDGET"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    <svg
                      className={`w-6 h-6 ${
                        transacao.type === "BUDGET"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {transacao.type === "BUDGET" ? (
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
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {transacao.description}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {transacao.category} • {formatDateTime(transacao.date)}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-lg font-bold ${
                    transacao.type === "BUDGET"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transacao.type === "BUDGET" ? "+" : "-"}R${" "}
                  {Math.abs(transacao.value).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
