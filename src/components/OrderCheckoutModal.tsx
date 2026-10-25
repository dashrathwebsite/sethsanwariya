import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import confetti from 'canvas-confetti';
import { X, CheckCircle, MessageCircle, Truck, MapPin, Phone, User } from 'lucide-react';

interface OrderCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const OrderCheckoutModal: React.FC<OrderCheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const { cart, cartSubtotal, deliveryCharge, cartTotal, createOrder, generateWhatsAppLink, settings } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'whatsapp' | 'cod'>('whatsapp');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert("कृपया अपना नाम, फ़ोन नंबर और पता अवश्य भरें।");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = cart.map(item => ({
        product_id: item.product.id,
        product_name_hi: item.product.name_hi,
        size: item.selectedSize,
        color: item.selectedColor.name_hi,
        price: item.product.price,
        quantity: item.quantity,
        image_url: item.product.main_image
      }));

      const newOrder = await createOrder({
        customer_name: name,
        customer_phone: phone,
        customer_address: address,
        customer_city: city || 'स्थानिक',
        customer_pincode: pincode || '',
        payment_method: paymentMethod,
        total_amount: cartTotal,
        items: orderItems,
        notes: notes
      });

      // Celebration
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      setConfirmedOrder(newOrder);
      onOrderSuccess(newOrder);
    } catch (err) {
      console.error("Order creation failed:", err);
      alert("ऑर्डर दर्ज करने में समस्या आई। कृपया पुनः प्रयास करें।");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenWhatsAppReceipt = () => {
    if (!confirmedOrder) return;
    const itemsList = confirmedOrder.items.map((i, idx) => 
      `${idx + 1}. ${i.product_name_hi} (${i.size}, ${i.color}) x ${i.quantity} = ₹${i.price * i.quantity}`
    ).join('\n');

    let text = `नमस्ते सेठ सांवरिया कलेक्शन! 🙏\n\nमैंने वेबसाइट पर ऑर्डर दिया है:\nऑर्डर आईडी: *${confirmedOrder.id}*\n\n*सामान सूची:*\n${itemsList}\n\n`;
    text += `सामान का मूल्य: ₹${cartSubtotal}\n`;
    text += `डिलीवरी शुल्क: ${deliveryCharge === 0 ? 'मुफ़्त' : `₹${deliveryCharge}`}\n`;
    text += `कुल देय राशि: *₹${confirmedOrder.total_amount}*\n\n`;
    text += `*ग्राहक विवरण:*\nनाम: ${confirmedOrder.customer_name}\nफ़ोन: ${confirmedOrder.customer_phone}\nपता: ${confirmedOrder.customer_address}, ${confirmedOrder.customer_city} (${confirmedOrder.customer_pincode})\n`;
    text += `भुगतान विधि: ${confirmedOrder.payment_method === 'cod' ? 'कैश ऑन डिलीवरी (COD)' : 'WhatsApp पुष्टि'}\n\n`;
    text += `कृपया ऑर्डर की पुष्टि और डिस्पैच विवरण बताएं।`;

    const link = generateWhatsAppLink(text);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8DFD5] bg-[#FAF8F5]">
          <h3 className="text-base sm:text-lg font-bold font-hindi text-[#1C1917]">
            {confirmedOrder ? 'ऑर्डर सफलतापूर्वक दर्ज हुआ! 🎉' : 'डिलीवरी का पता व ऑर्डर की पुष्टि'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-[#44403C] hover:text-[#1C1917] hover:bg-[#EAE0D3] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {confirmedOrder ? (
            /* Order Success View */
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-semibold text-[#8C7A68] uppercase tracking-wider">
                  ऑर्डर संदर्भ संख्या (Order ID)
                </span>
                <p className="text-xl font-bold font-mono text-[#1C1917] mt-0.5">
                  {confirmedOrder.id}
                </p>
                <p className="text-xs text-[#786C5E] mt-1 font-hindi">
                  आपका ऑर्डर सिस्टम में सुरक्षित दर्ज हो चुका है।
                </p>
              </div>

              {/* Order Summary Box */}
              <div className="bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl p-4 text-left space-y-2 text-xs font-hindi">
                <div className="flex justify-between">
                  <span className="text-[#786C5E]">ग्राहक का नाम:</span>
                  <span className="font-semibold text-[#1C1917]">{confirmedOrder.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#786C5E]">फ़ोन नंबर:</span>
                  <span className="font-semibold text-[#1C1917]">{confirmedOrder.customer_phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#786C5E]">डिलीवरी पता:</span>
                  <span className="font-semibold text-[#1C1917] text-right max-w-[65%]">
                    {confirmedOrder.customer_address}, {confirmedOrder.customer_city} ({confirmedOrder.customer_pincode})
                  </span>
                </div>
                <div className="border-t border-[#E8DFD5] pt-2 flex justify-between text-sm font-bold">
                  <span>कुल देय राशि:</span>
                  <span className="text-[#9A6B1F] tabular-nums">₹{confirmedOrder.total_amount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Direct WhatsApp Confirmation CTA */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleOpenWhatsAppReceipt}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#1C1917] hover:bg-[#2E2824] text-white rounded-xl font-bold font-hindi text-sm shadow-md transition-all"
                >
                  <MessageCircle className="w-5 h-5 text-[#4ADE80]" />
                  <span>दुकानदार को WhatsApp पर रसीद भेजें</span>
                </button>

                <p className="text-[11px] text-[#786C5E] font-hindi">
                  दुकानदार को WhatsApp भेजकर आप तुरंत डिलीवरी का समय जान सकते हैं।
                </p>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-semibold text-[#786C5E] hover:text-[#1C1917] underline"
                >
                  शॉपिंग जारी रखें
                </button>
              </div>
            </div>
          ) : (
            /* Order Input Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Order total reminder */}
              <div className="bg-[#FAF8F5] border border-[#E8DFD5] rounded-xl p-3 flex items-center justify-between text-xs font-hindi">
                <div>
                  <span className="text-[#786C5E]">{cart.length} प्रकार के कपड़े ({cart.reduce((s,i) => s + i.quantity, 0)} पीस)</span>
                  <p className="font-bold text-[#1C1917] text-sm tabular-nums">कुल: ₹{cartTotal.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right text-[11px] text-[#9A6B1F]">
                  {deliveryCharge === 0 ? '✓ मुफ्त डिलीवरी' : `डिलीवरी: ₹${deliveryCharge}`}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold font-hindi text-[#1C1917] mb-1">
                  आपका पूरा नाम (Full Name) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C7A68] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="उदा. राजेश कुमार"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-[#D5C7B8] rounded-lg focus:outline-none focus:border-[#9A6B1F] bg-[#FAF8F5]/50"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold font-hindi text-[#1C1917] mb-1">
                  फ़ोन / WhatsApp नंबर *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8C7A68] absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10 अंकों का मोबाइल नंबर"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-[#D5C7B8] rounded-lg focus:outline-none focus:border-[#9A6B1F] bg-[#FAF8F5]/50"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold font-hindi text-[#1C1917] mb-1">
                  डिलीवरी का पूरा पता (Street Address, House No.) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#8C7A68] absolute left-3 top-3" />
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="मकान नंबर, गली/मोहल्ला, पास की प्रसिद्ध जगह (Landmark)"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-[#D5C7B8] rounded-lg focus:outline-none focus:border-[#9A6B1F] bg-[#FAF8F5]/50"
                  />
                </div>
              </div>

              {/* City and Pincode */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold font-hindi text-[#1C1917] mb-1">
                    शहर / कस्बा (City)
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="उदा. जयपुर"
                    className="w-full px-3 py-2 text-sm border border-[#D5C7B8] rounded-lg focus:outline-none focus:border-[#9A6B1F] bg-[#FAF8F5]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold font-hindi text-[#1C1917] mb-1">
                    पिनकोड (Pincode)
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="6 अंकों का पिनकोड"
                    className="w-full px-3 py-2 text-sm border border-[#D5C7B8] rounded-lg focus:outline-none focus:border-[#9A6B1F] bg-[#FAF8F5]/50"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold font-hindi text-[#1C1917] mb-1.5">
                  भुगतान का तरीका चुनें:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer text-xs font-hindi transition-colors ${
                    paymentMethod === 'whatsapp' ? 'border-[#9A6B1F] bg-[#FAF8F5] font-semibold' : 'border-[#E8DFD5]'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="whatsapp"
                      checked={paymentMethod === 'whatsapp'}
                      onChange={() => setPaymentMethod('whatsapp')}
                      className="text-[#9A6B1F]"
                    />
                    <span>WhatsApp पर पुष्टि</span>
                  </label>

                  <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer text-xs font-hindi transition-colors ${
                    paymentMethod === 'cod' ? 'border-[#9A6B1F] bg-[#FAF8F5] font-semibold' : 'border-[#E8DFD5]'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-[#9A6B1F]"
                    />
                    <span>कैश ऑन डिलीवरी (COD)</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-[#1C1917] hover:bg-[#2E2824] disabled:opacity-50 text-white rounded-xl font-bold font-hindi text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4 text-[#E2B158]" />
                  <span>{isSubmitting ? 'ऑर्डर दर्ज हो रहा है...' : 'ऑर्डर कन्फर्म करें'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
