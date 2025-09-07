import { prisma } from "@/lib/prisma";

export async function getAllPromos() {
  return await prisma.promoItem.findMany({
    orderBy: { expiry: "asc" },
  });
}