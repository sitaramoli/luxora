import {
  AlertTriangle,
  DollarSign,
  Package,
  ShoppingBag,
  Store,
  Users,
} from "lucide-react";

export const stats = [
  {
    title: "Total Revenue",
    value: "$2,847,392",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Active Users",
    value: "12,847",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Total Orders",
    value: "3,429",
    change: "+15.3%",
    changeType: "positive" as const,
    icon: ShoppingBag,
  },
  {
    title: "Active Vendors",
    value: "247",
    change: "+5.1%",
    changeType: "positive" as const,
    icon: Store,
  },
  {
    title: "Products Listed",
    value: "18,492",
    change: "+22.8%",
    changeType: "positive" as const,
    icon: Package,
  },
  {
    title: "Pending Reviews",
    value: "89",
    change: "-3.2%",
    changeType: "negative" as const,
    icon: AlertTriangle,
  },
];

export const recentOrders = [
  {
    id: "ORD-001",
    customer: "Sarah Johnson",
    merchant: "Chanel",
    amount: "$2,850",
    status: "COMPLETED",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Michael Chen",
    merchant: "Gucci",
    amount: "$1,200",
    status: "PROCESSING",
    date: "2024-01-15",
  },
  {
    id: "ORD-003",
    customer: "Emma Wilson",
    merchant: "Hermès",
    amount: "$4,500",
    status: "SHIPPED",
    date: "2024-01-14",
  },
  {
    id: "ORD-004",
    customer: "David Brown",
    merchant: "Prada",
    amount: "$890",
    status: "PENDING",
    date: "2024-01-14",
  },
];

export const pendingMerchants = [
  {
    id: "VEN-001",
    name: "Luxury Timepieces Co.",
    category: "Watches",
    submittedDate: "2024-01-10",
    status: "PENDING",
  },
  {
    id: "VEN-002",
    name: "Elite Fashion House",
    category: "Clothing",
    submittedDate: "2024-01-12",
    status: "UNDER_REVIEW",
  },
  {
    id: "VEN-003",
    name: "Premium Accessories Ltd.",
    category: "Accessories",
    submittedDate: "2024-01-13",
    status: "PENDING",
  },
];
