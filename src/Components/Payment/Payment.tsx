import { Application } from "@/types/Application";
import { User } from "@/types/user";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Payment({
  amount,
  user,
}: {
  amount: number;
  user: User;
}) {
  const router = useRouter();
  const handlePayment = async () => {
    toast.loading("Processing payment....");
    try {
      const paymentRes = await axios.post("/api/payment", {
        amount: amount * 100,
      });
      toast.dismiss();
      const options = {
        key_id: "rzp_test_cXJvckaWoN0JQx",
        amount: paymentRes.data.amount || amount * 100,
        currency: "INR",
        name: "MediFind",
        description: "Medicine Order Payment",
        order_id: paymentRes.data.orderId,
        handler: () => {
          toast.success("Payment Successful!");
          (
            document.getElementById("paymentModal") as HTMLDialogElement
          ).close();
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        (document.getElementById("paymentModal") as HTMLDialogElement).close();
        router.push("/user/apply");
        toast.error(response.error.description);
      });
      rzp.open();
    } catch (error: any) {
      console.log(error);
      toast.dismiss();
      toast.error(error?.response.data.message);
    }
  };

  return (
    <>
      <dialog id="paymentModal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box h-full w-full">
          <h3 className="text-lg font-bold">{`Payment of ${amount} for ${user.name}`}</h3>
          <button
            className="btn btn-lg mx-auto my-auto"
            onClick={handlePayment}
          >
            Confirm Payment
          </button>
        </div>
      </dialog>
    </>
  );
}
