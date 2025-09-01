export const initialVendorData = {
  name: "Chanel",
  email: "contact@chanel.com",
  phone: "+33 1 44 50 73 00",
  website: "https://chanel.com",
  address: "135 Avenue Charles de Gaulle, 92200 Neuilly-sur-Seine, France",
  description: "Timeless elegance and sophisticated luxury fashion.",
  category: "Fashion",
  commission: 15,
  status: "ACTIVE",
};

export const initialProducts = [
  {
    id: "PRD-001",
    name: "Silk Evening Gown",
    price: "$2,850",
    status: "ACTIVE",
  },
  { id: "PRD-002", name: "Leather Handbag", price: "$4,200", status: "ACTIVE" },
  {
    id: "PRD-003",
    name: "Designer Sunglasses",
    price: "$350",
    status: "PENDING",
  },
];

export const recentOrders = [
  {
    id: "ORD-001",
    customer: "Sarah Johnson",
    amount: "$2,850",
    date: "2024-01-15",
    status: "COMPLETED",
  },
  {
    id: "ORD-002",
    customer: "Michael Chen",
    amount: "$1,200",
    date: "2024-01-14",
    status: "SHIPPED",
  },
  {
    id: "ORD-003",
    customer: "Emma Wilson",
    amount: "$4,500",
    date: "2024-01-13",
    status: "PROCESSING",
  },
];
