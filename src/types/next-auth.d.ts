import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "OWNER" | "MANAGER" | "CASHIER" | "EMPLOYEE";
      storeId: string | null;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: "OWNER" | "MANAGER" | "CASHIER" | "EMPLOYEE";
    storeId: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "OWNER" | "MANAGER" | "CASHIER" | "EMPLOYEE";
    storeId: string | null;
  }
}