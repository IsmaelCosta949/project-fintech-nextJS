const API_BASE_URL = "http://localhost:8080/api/accounts";

export const getUser = async (email: string, senha: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password: senha }),
    });

    if (!response.ok) {
      throw new Error("Erro ao fazer login");
    }

    const data = await response.json();
    
    localStorage.setItem("accountId", data.accountId.toString());
    localStorage.setItem("userName", data.name);
    localStorage.setItem("userEmail", data.email);

    return data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};

export const getUserProfile = async (accountId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${accountId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar dados do usuário");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    throw error;
  }
};

export const updateUser = async (accountId: number, userData: {
  name: string;
  cpf: string;
  monthlyIncome: number;
  email: string;
  password: string;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${accountId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar dados do usuário");
    }

    const data = await response.json();
    
    localStorage.setItem("userName", data.name);
    localStorage.setItem("userEmail", data.email);
    if (data.monthlyIncome !== undefined && data.monthlyIncome !== null) {
      localStorage.setItem("salarioMensal", data.monthlyIncome.toString());
    }

    return data;
  } catch (error) {
    console.error("Erro ao atualizar dados do usuário:", error);
    throw error;
  }
};
