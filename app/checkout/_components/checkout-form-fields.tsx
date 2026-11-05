import { Phone, MapPin, Banknote } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NEPAL_PROVINCES, POPULAR_CITIES } from "@/lib/constants/nepal";
import type { CheckoutFormData } from "@/hooks/use-checkout";

interface Props {
  formData: CheckoutFormData;
  setField: <K extends keyof CheckoutFormData>(key: K, value: CheckoutFormData[K]) => void;
}

export function CheckoutFormFields({ formData, setField }: Props) {
  return (
    <div className="space-y-6">
            <div className="lg:col-span-7 space-y-6">
              
              {/* Contact Information */}
              <div className="bg-card border border-border/70 rounded-2xl p-5 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                  <Phone className="w-4 h-4 text-brand-blue" />
                  <h2 className="font-serif font-bold text-lg">Contact Information</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={formData.fullName}
                      onChange={(e) => setField("fullName", e.target.value)}
                      className="rounded-xl h-11"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Phone Number (Mobile) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      required
                      placeholder="98XXXXXXXX / 97XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      className="rounded-xl h-11"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email Address (Optional)
                  </label>
                  <Input
                    type="email"
                    placeholder="For order receipt & updates"
                    value={formData.email}
                    onChange={(e) => setField("email", e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-card border border-border/70 rounded-2xl p-5 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                  <MapPin className="w-4 h-4 text-brand-gold" />
                  <h2 className="font-serif font-bold text-lg">Delivery Address in Nepal</h2>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Province <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) => setField("province", e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  >
                    {NEPAL_PROVINCES.map(prov => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    City / Town / Area <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Baneshwor, Kathmandu"
                    value={formData.city}
                    onChange={(e) => setField("city", e.target.value)}
                    className="rounded-xl h-11"
                  />
                  {/* Quick City Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {POPULAR_CITIES.slice(0, 5).map(c => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setField("city", c)}
                        className="text-[11px] px-2.5 py-0.5 rounded-full bg-muted hover:bg-brand-blue/15 hover:text-brand-blue font-medium transition-colors"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Street Address & Nearby Landmark <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="House/Ward number, Street name, Near School/Chowk"
                    value={formData.address}
                    onChange={(e) => setField("address", e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Order Notes / Delivery Instructions (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Call before coming, deliver in afternoon"
                    value={formData.notes}
                    onChange={(e) => setField("notes", e.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card border border-border/70 rounded-2xl p-5 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <h2 className="font-serif font-bold text-lg">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  {/* COD Option */}
                  <label className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-colors cursor-pointer ${formData.paymentMethod === 'cod' ? 'border-brand-blue bg-brand-blue/5' : 'border-border/70 hover:border-border'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={() => setField("paymentMethod", "cod")}
                      className="mt-1 text-brand-blue focus:ring-brand-blue"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-foreground">Cash On Delivery (COD)</span>
                        <span className="text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">Recommended</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Pay cash directly to our delivery courier when the books reach your doorstep. You can inspect the book package before paying.
                      </p>
                    </div>
                  </label>

                  {/* Fonepay / QR Option */}
                  <label className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-colors cursor-pointer ${formData.paymentMethod === 'qr' ? 'border-brand-blue bg-brand-blue/5' : 'border-border/70 hover:border-border'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="qr"
                      checked={formData.paymentMethod === "qr"}
                      onChange={() => setField("paymentMethod", "qr")}
                      className="mt-1 text-brand-blue focus:ring-brand-blue"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-foreground">Fonepay / eSewa / Khalti QR</span>
                        <span className="text-xs text-muted-foreground">Digital</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        We will send the official BookMello payment QR code on WhatsApp or upon courier arrival.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

            </div>
    </div>
  );
}
