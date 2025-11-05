import { Users } from "../interfaces/users";

const API_BASE_URL = "https://wallets-api-fintech.onrender.com/api";

export const userService = {
  async getUser(email: string, senha: string): Promise<Users> {
    const res = await fetch(`${API_BASE_URL}/accounts/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: senha,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch recent transactions: ${res.statusText}`);
    }

    const data = await res.json();

    console.log(data);

    return {
      accountId: 0,
      name: "joao",
      status: "ativo",
      email: "joao.silva@gmail.com",
    };
  },
};
