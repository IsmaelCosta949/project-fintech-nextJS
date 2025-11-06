import { Users, UsersLogin } from "../interfaces/users";

const API_BASE_URL = "http://localhost:8080/api";

export const userService = {
  async login(email: string, senha: string): Promise<UsersLogin> {
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
      throw new Error(`Failed to login: ${res.statusText}`);
    }

    const data = await res.json();

    return data;
  },
  async getUser(userId: number): Promise<Users> {
    const res = await fetch(`${API_BASE_URL}/accounts/${userId}`);

    if (!res.ok) {
      throw new Error(`Failed to get user: ${res.statusText}`);
    }

    const data = await res.json();

    return data;
  },
};
