import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAllOrders } from "@/lib/services/orders";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action");

  try {
    switch (action) {
      case "getAllOrders":
        const orders = await getAllOrders(session.user.id);
        return NextResponse.json({
          orders,
        });

      default:
        return NextResponse.json(
          { error: "Invalid data type specified" },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
