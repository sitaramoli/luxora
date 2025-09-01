"use server";

import { AccountStatus } from "@/types";
import { db } from "@/database/drizzle";
import { merchants } from "@/database/schema";
import { eq } from "drizzle-orm";

export const getAllMerchantDetails = async () => {
  return [
    {
      id: "VEN-001",
      name: "Chanel",
      email: "contact@chanel.com",
      category: "Fashion",
      status: "ACTIVE",
      createdAt: "2023-01-15",
      totalProducts: 245,
      totalSales: "$1,247,392",
      rating: 4.9,
      verified: true,
      description: "Timeless elegance and sophisticated luxury fashion.",
      website: "https://chanel.com",
      phone: "+33 1 44 50 73 00",
      address: "135 Avenue Charles de Gaulle, 92200 Neuilly-sur-Seine, France",
      commission: 15,
      lastActive: "2024-01-15",
    },
    {
      id: "VEN-002",
      name: "Gucci",
      email: "info@gucci.com",
      category: "Fashion",
      status: "ACTIVE",
      createdAt: "2023-02-20",
      totalProducts: 189,
      totalSales: "$892,156",
      rating: 4.8,
      verified: true,
      description: "Italian luxury fashion house known for leather goods.",
      website: "https://gucci.com",
      phone: "+39 055 75921",
      address: "Via Tornabuoni 73/R, 50123 Florence, Italy",
      commission: 18,
      lastActive: "2024-01-14",
    },

    {
      id: "VEN-003",
      name: "Hermès",
      email: "contact@hermes.com",
      category: "Luxury Goods",
      status: "ACTIVE",
      createdAt: "2023-01-10",
      totalProducts: 156,
      totalSales: "$2,156,789",
      rating: 4.9,
      verified: true,
      description: "French luxury goods manufacturer specializing in leather.",
      website: "https://hermes.com",
      phone: "+33 1 40 17 47 17",
      address: "24 Rue du Faubourg Saint-Honoré, 75008 Paris, France",
      commission: 12,
      lastActive: "2024-01-15",
    },
    {
      id: "VEN-004",
      name: "Luxury Timepieces Co.",
      email: "info@luxurytimepieces.com",
      category: "Watches",
      status: "PENDING",
      createdAt: "2024-01-10",
      totalProducts: 0,
      totalSales: "$0",
      rating: 0,
      verified: false,
      description: "Premium watch retailer specializing in Swiss timepieces.",
      website: "https://luxurytimepieces.com",
      phone: "+1 555 123 4567",
      address: "123 Watch Street, New York, NY 10001",
      commission: 20,
      lastActive: "2024-01-10",
    },
    {
      id: "VEN-005",
      name: "Elite Fashion House",
      email: "contact@elitefashion.com",
      category: "Clothing",
      status: "UNDER_REVIEW",
      createdAt: "2024-01-12",
      totalProducts: 0,
      totalSales: "$0",
      rating: 0,
      verified: false,
      description: "Contemporary fashion brand with modern designs.",
      website: "https://elitefashion.com",
      phone: "+1 555 987 6543",
      address: "456 Fashion Ave, Los Angeles, CA 90210",
      commission: 25,
      lastActive: "2024-01-12",
    },
    {
      id: "VEN-006",
      name: "Diamond Dynasty",
      email: "sales@diamonddynasty.com",
      category: "Jewelry",
      status: "SUSPENDED",
      createdAt: "2023-08-15",
      totalProducts: 45,
      totalSales: "$156,789",
      rating: 3.8,
      verified: false,
      description: "Fine jewelry and diamond specialist.",
      website: "https://diamonddynasty.com",
      phone: "+1 555 456 7890",
      address: "789 Diamond District, New York, NY 10036",
      commission: 22,
      lastActive: "2023-12-20",
    },
  ];
};

export const changeMerchantAccountStatus = async (
  id: string,
  newStatus: AccountStatus,
) => {
  try {
    await db
      .update(merchants)
      .set({ status: newStatus })
      .where(eq(merchants.id, id));
    return { success: true, message: "Status updated successfully." };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, message: "Failed to update status." };
  }
};
