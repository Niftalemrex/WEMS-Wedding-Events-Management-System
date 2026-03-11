import React, { useEffect, useState } from "react";
import {
  STORAGE_KEYS,
  getFromStorage,
  addToStorageArray,
  updateStorageArray,
} from "../utils/StorageUtils";
import { Gift } from "lucide-react";
import { useAppSettings } from "../Contexts/AppSettingsContext";
import "./AttendeeGiftRegistry.css";

export type GiftItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
};

export type BoughtGiftItem = GiftItem & {
  boughtAt: string; // timestamp
};

const AttendeeGiftRegistry: React.FC = () => {
  const { t } = useAppSettings();
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [boughtGifts, setBoughtGifts] = useState<BoughtGiftItem[]>([]);

  // Load gifts from storage
  useEffect(() => {
    setGifts(getFromStorage<GiftItem[]>(STORAGE_KEYS.GIFT_INVENTORY, []));
    setBoughtGifts(getFromStorage<BoughtGiftItem[]>(STORAGE_KEYS.GIFT_BOUGHT, []));
  }, []);

  const buyGift = (gift: GiftItem) => {
    if (gift.quantity <= 0) {
      alert(t("giftSoldOut"));
      return;
    }

    // Reduce inventory by 1
    const updatedGift: GiftItem = { ...gift, quantity: gift.quantity - 1 };
    updateStorageArray<GiftItem>(
      STORAGE_KEYS.GIFT_INVENTORY,
      g => g.id === gift.id, // filter function
      g => updatedGift // update function
    );
    setGifts(prev => prev.map(g => (g.id === gift.id ? updatedGift : g)));

    // Add to bought gifts
    const boughtGift: BoughtGiftItem = { ...gift, boughtAt: new Date().toISOString() };
    addToStorageArray<BoughtGiftItem>(STORAGE_KEYS.GIFT_BOUGHT, boughtGift);
    setBoughtGifts(prev => [...prev, boughtGift]);
  };

  return (
    <div className="attendee-gift-container p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Gift /> {t("giftRegistry")}
      </h1>

      {gifts.length === 0 ? (
        <p className="text-gray-500 text-center">{t("noGiftsRegistered")}</p>
      ) : (
        <ul className="gift-list grid grid-cols-1 md:grid-cols-2 gap-4">
          {gifts.map(g => (
            <li
              key={g.id}
              className={`gift-card border p-3 rounded shadow hover:shadow-md transition cursor-pointer ${
                g.quantity <= 0 ? "bg-gray-200 cursor-not-allowed" : "bg-white"
              }`}
              onClick={() => g.quantity > 0 && buyGift(g)}
            >
              <div className="gift-info flex items-center gap-3">
                {g.image && (
                  <img
                    src={g.image}
                    alt={g.name}
                    className="h-16 w-16 object-cover rounded"
                  />
                )}
                <div>
                  <div className="font-semibold">{g.name}</div>
                  <div>{t("quantity")}: {g.quantity}</div>
                  <div>{t("price")}: ${g.price.toFixed(2)}</div>
                </div>
              </div>
              <div className="gift-status mt-2 text-sm font-medium">
                {g.quantity <= 0 ? t("soldOut") + " ❌" : t("available") + " ⬜"}
              </div>
            </li>
          ))}
        </ul>
      )}

      {boughtGifts.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">{t("boughtGifts")}</h2>
          <ul className="gift-list grid grid-cols-1 md:grid-cols-2 gap-4">
            {boughtGifts.map((g, index) => (
              <li
                key={`${g.id}-${index}`}
                className="gift-card border p-3 rounded bg-gray-100 shadow"
              >
                <div className="gift-info flex items-center gap-3">
                  {g.image && (
                    <img
                      src={g.image}
                      alt={g.name}
                      className="h-16 w-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <div className="font-semibold">{g.name}</div>
                    <div>{t("price")}: ${g.price.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">
                      {t("boughtAt")}: {new Date(g.boughtAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default AttendeeGiftRegistry;
