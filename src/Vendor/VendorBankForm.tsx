// src/Vendor/VendorBankForm.tsx
import React, { useState, useEffect } from "react";
import { STORAGE_KEYS, addToStorageArray, getFromStorage } from "../utils/StorageUtils";
import { v4 as uuidv4 } from "uuid"; // for unique payment ID

export type VendorBankDetail = {
  id: string;
  vendorName: string;
  businessName: string;
  amount: number;
  status: "pending" | "approved" | "payment_sent" | "paid";
  bankInfo: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    swiftCode?: string;
  };
};

const VendorBankForm: React.FC = () => {
  const [details, setDetails] = useState<Omit<VendorBankDetail, "id" | "status">>({
    vendorName: "",
    businessName: "",
    amount: 0,
    bankInfo: {
      bankName: "",
      accountName: "",
      accountNumber: "",
      swiftCode: "",
    },
  });

  const [allPayments, setAllPayments] = useState<VendorBankDetail[]>([]);

  // Load all saved payments on mount
  useEffect(() => {
    const saved = getFromStorage<VendorBankDetail[]>(STORAGE_KEYS.VENDOR_BANK_FORM, []);
    setAllPayments(saved);
  }, []);

  const handleSubmit = () => {
    if (
      !details.vendorName ||
      !details.businessName ||
      !details.bankInfo.bankName ||
      !details.bankInfo.accountName ||
      !details.bankInfo.accountNumber ||
      details.amount <= 0
    ) {
      alert("Please fill in all required fields and amount.");
      return;
    }

    const payment: VendorBankDetail = {
      id: uuidv4(),
      vendorName: details.vendorName,
      businessName: details.businessName,
      amount: details.amount,
      status: "pending",
      bankInfo: details.bankInfo,
    };

    // Save to storage
    addToStorageArray(STORAGE_KEYS.VENDOR_BANK_FORM, payment);

    // Update state to show in table
    setAllPayments(prev => [...prev, payment]);

    alert("Bank details sent successfully!");

    // reset form
    setDetails({
      vendorName: "",
      businessName: "",
      amount: 0,
      bankInfo: {
        bankName: "",
        accountName: "",
        accountNumber: "",
        swiftCode: "",
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Send Bank Details</h1>

      <div className="space-y-3 mb-6">
        <input
          placeholder="Vendor Name"
          value={details.vendorName}
          onChange={e => setDetails({ ...details, vendorName: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          placeholder="Business Name"
          value={details.businessName}
          onChange={e => setDetails({ ...details, businessName: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          placeholder="Bank Name"
          value={details.bankInfo.bankName}
          onChange={e => setDetails({ ...details, bankInfo: { ...details.bankInfo, bankName: e.target.value } })}
          className="border p-2 rounded w-full"
        />
        <input
          placeholder="Account Name"
          value={details.bankInfo.accountName}
          onChange={e => setDetails({ ...details, bankInfo: { ...details.bankInfo, accountName: e.target.value } })}
          className="border p-2 rounded w-full"
        />
        <input
          placeholder="Account Number"
          value={details.bankInfo.accountNumber}
          onChange={e => setDetails({ ...details, bankInfo: { ...details.bankInfo, accountNumber: e.target.value } })}
          className="border p-2 rounded w-full"
        />
        <input
          placeholder="SWIFT Code (Optional)"
          value={details.bankInfo.swiftCode}
          onChange={e => setDetails({ ...details, bankInfo: { ...details.bankInfo, swiftCode: e.target.value } })}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          placeholder="Amount"
          value={details.amount}
          onChange={e => setDetails({ ...details, amount: Number(e.target.value) })}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>

      {/* Table to show added details */}
      <h2 className="text-xl font-semibold mb-2">All Submitted Bank Details</h2>
      {allPayments.length === 0 ? (
        <p>No bank details submitted yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Vendor</th>
                <th className="border p-2">Business</th>
                <th className="border p-2">Bank</th>
                <th className="border p-2">Account Name</th>
                <th className="border p-2">Account Number</th>
                <th className="border p-2">SWIFT</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {allPayments.map(p => (
                <tr key={p.id}>
                  <td className="border p-2">{p.vendorName}</td>
                  <td className="border p-2">{p.businessName}</td>
                  <td className="border p-2">{p.bankInfo.bankName}</td>
                  <td className="border p-2">{p.bankInfo.accountName}</td>
                  <td className="border p-2">{p.bankInfo.accountNumber}</td>
                  <td className="border p-2">{p.bankInfo.swiftCode || "-"}</td>
                  <td className="border p-2">${p.amount}</td>
                  <td className="border p-2 capitalize">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VendorBankForm;
