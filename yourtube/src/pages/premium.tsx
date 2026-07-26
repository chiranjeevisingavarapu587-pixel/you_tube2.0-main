import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
export default function PremiumPage() {
  const router = useRouter();
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  const handlePayment = (
    amount: number,
    plan: string,
    color: string
  ) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      amount: amount * 100,
      currency: "INR",
      name: `YouTube ${plan}`,
      description: `${plan} Subscription`,
      handler: async function (response: any) {
        await axios.post("http://localhost:5000/premium/update", {
          userId: localStorage.getItem("userId"), plan: plan.toLowerCase(),
        });
        console.log("API Success");
         console.log("Saving plan...");
        localStorage.setItem(
          "plan",
          plan.toLowerCase()
        );
        const expiryDate = new Date();
        expiryDate.setMonth(
          expiryDate.getMonth() + 1
        );
        localStorage.setItem(
          "premiumExpiry",
          expiryDate.toISOString()
        );
        alert(`Payment Successful!`);
        console.log(response);
      },
      theme: {
        color: color,
      },
    };
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 gap-4">
      {router.query.message === "limit" && (
        <div className="w-full max-w-sm bg-red-600/30 border-2 border-red-500 text-red-200 p-4 rounded-xl mb-4 text-center font-semibold shadow-lg animate-pulse">
          Free users can download only 1 video per day
        </div>
      )}
      <h1 className="text-4xl font-bold text-center">
        Upgrade to Premium
      </h1>
      <p className="text-gray-400 text-center mb-4">
        Enjoy unlimited video downloads and premium features.
      </p>
      {/* PLANS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {/* BRONZE */}
        <div className="bg-[#2d1f1a] border border-[#cd7f32] rounded-2xl p-6 shadow-lg">
          <h2 className="text-3xl font-bold mb-2 text-[#cd7f32]">
            Bronze Plan
          </h2>
          <p className="text-5xl font-bold text-[#cd7f32] mb-4">
            ₹10
            <span className="text-lg text-gray-300">
              {" "} / month
            </span>
          </p>
          <ul className="space-y-3 text-gray-200 mb-6">
            <li>☑ 7 Minutes Watch Time</li>
            <li>☑ Limited Downloads</li>
            <li>☑ Basic Support</li>
          </ul>
          <button
            onClick={() =>
              handlePayment(
                10,
                "Bronze",
                "#cd7f32"
              )
            }
            className="w-full bg-[#cd7f32] text-white hover:scale-105 transition-all py-3 rounded-xl font-bold"
          >
            Upgrade to Bronze
          </button>
        </div>
        {/* SILVER */}
        <div className="bg-gradient-to-br from-[#c0c0c0] to-[#6b7280] border border-gray-300 rounded-2xl p-6 shadow-[0_0_35px_rgba(192,192,192,0.35)]">
          <h2 className="text-3xl font-bold text-white mb-2">
            Silver Plan
          </h2>
          <p className="text-5xl font-bold mb-4 text-white">
            ₹50
            <span className="text-lg text-gray-200">
              {" "} / month
            </span>
          </p>
          <ul className="space-y-3 text-white mb-6">
            <li>☑ 30 Minutes Watch Time</li>
            <li>☑ 10 Downloads / day</li>
            <li>☑ Priority Support</li>
          </ul>
          <button
            onClick={() =>
              handlePayment(
                50,
                "Silver",
                "#9ca3af"
              )
            }
            className="w-full bg-white text-gray-800 hover:bg-gray-200 transition-all py-3 rounded-xl font-bold"
          >
            Upgrade to Silver
          </button>
        </div>
        {/* GOLD */}
        <div className="bg-gradient-to-br from-white via-yellow-50 to-amber-50 border-2 border-yellow-600 rounded-3xl p-8 shadow-[0_0_30px_rgba(251,191,36,0.25)]">
          <h2 className="text-3xl font-extrabold mb-2 text-yellow-700">
            Gold Plan
          </h2>
          <p className="text-5xl font-extrabold mb-4 text-yellow-800">
            ₹100
            <span className="text-lg text-yellow-700">
              {" "} / month
            </span>
          </p>
          <ul className="space-y-3 text-gray-800 font-medium mb-6">
            <li>✅ Unlimited Watch Time</li>
            <li>✅ Unlimited Downloads</li>
            <li>✅ Premium Support</li>
          </ul>
          <button
            onClick={() =>
              handlePayment(
                100,
                "Gold",
                "#facc15"
              )
            }
            className="w-full bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(250,204,21,0.5)] transition-all duration-300 py-3 rounded-xl font-bold text-lg text-black"
          >
            Upgrade to Gold
          </button>
        </div>
      </div>
      {/* BACK BUTTON */}
      <Link href="/">
        <button className="mt-6 px-8 py-3 rounded-xl border border-zinc-700 text-white hover:bg-zinc-800 transition-all font-semibold">
          Back to Home
        </button>
      </Link>
    </div>
  );
}