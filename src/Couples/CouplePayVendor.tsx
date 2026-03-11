import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { STORAGE_KEYS, getFromStorage, updateStorageArray } from "../utils/StorageUtils";

type BankInfo = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  swiftCode?: string;
};

export type VendorPayment = {
  id: string;
  vendorName?: string;
  businessName?: string;
  amount: number;
  status: "pending" | "approved" | "payment_sent" | "paid";
  bankInfo?: BankInfo;
  proofImage?: string;
};

const CouplePayVendor: React.FC = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<VendorPayment | null>(null);
  const [proof, setProof] = useState<string>("");

  useEffect(() => {
    // Get all payments from the correct storage key
    const payments = getFromStorage<VendorPayment[]>(STORAGE_KEYS.VENDOR_PAYMENTS, []);
    if (!payments || payments.length === 0) return;

    // Try to find by URL id
    let found = payments.find(p => p.id === paymentId);

    // If not found, pick the first pending/approved payment automatically
    if (!found) {
      found = payments.find(p => p.status === "pending" || p.status === "approved") || payments[0];
    }

    setPayment(found);
  }, [paymentId]);

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProof(reader.result as string);
    reader.readAsDataURL(file);
  };

  const submitPayment = () => {
    if (!payment) return alert("Payment not found!");
    if (!payment.bankInfo) return alert("Vendor bank info is missing!");
    if (!proof) return alert("Upload payment proof!");

    updateStorageArray<VendorPayment>(
      STORAGE_KEYS.VENDOR_PAYMENTS,
      p => p.id === payment.id,
      p => ({ ...p, status: "payment_sent", proofImage: proof })
    );

    alert("Payment proof sent to vendor successfully!");
    navigate("/couple/budgets");
  };

  if (!payment) return <p className="text-red-600 font-semibold">No payments available</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pay Vendor</h1>

      <div className="bg-white p-4 rounded shadow space-y-3">
        <p><strong>Vendor:</strong> {payment.vendorName || "Unknown Vendor"}</p>
        <p><strong>Business:</strong> {payment.businessName || "N/A"}</p>
        <p><strong>Amount:</strong> ${payment.amount}</p>

        <hr />

        <h3 className="font-semibold">Bank Details</h3>
        {payment.bankInfo ? (
          <>
            <p>Bank: {payment.bankInfo.bankName}</p>
            <p>Account Name: {payment.bankInfo.accountName}</p>
            <p>Account Number: {payment.bankInfo.accountNumber}</p>
            {payment.bankInfo.swiftCode && <p>SWIFT: {payment.bankInfo.swiftCode}</p>}
          </>
        ) : (
          <p className="text-red-600">Vendor has not provided bank details yet.</p>
        )}

        <hr />

        <label className="font-semibold block">Upload Payment Proof</label>
        <input type="file" accept="image/*" onChange={handleProofUpload} />
        {proof && <img src={proof} alt="Proof" className="rounded mt-2" />}

        <button
          disabled={!payment.bankInfo}
          onClick={submitPayment}
          className={`w-full py-2 rounded text-white ${
            payment.bankInfo ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Send Proof to Vendor
        </button>
      </div>
    </div>
  );
};

export default CouplePayVendor;
