import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req: NextRequest) {
  const { amount } = await req.json();
  if (!amount) {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }
  try {
    var options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `rcp_${Date.now()}`,
    };
    const paymentOrder = await razorpay.orders.create(options);
    if (!paymentOrder) {
      return NextResponse.json(
        { message: "Order creation failed!" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        message: "Payment successful",
        orderId: paymentOrder.id,
        amount: paymentOrder.amount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to proceed to payment" },
      { status: 500 }
    );
  }
}
