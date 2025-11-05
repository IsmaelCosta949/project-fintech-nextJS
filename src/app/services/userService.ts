import { Users } from "../interfaces/users";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const userService = {
  async getUser(): Promise<Users> {
    // const res = await fetch(`${API_BASE_URL}/user`);
    // if (!res.ok) {
    //   throw new Error(`Failed to fetch user: ${res.statusText}`);
    // }

    // const data = await res.json();

    return {
      nome: "João da Silva",
      email: "joao@email.com",
      cpf: "123.456.789-00",
      telefone: "(11) 98765-4321",
      dinheiroMensal: 5000.0,
      dataCadastro: "2024-01-15",
    };
  },
};
