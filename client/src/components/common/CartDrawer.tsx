import React, { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { SiteSettings } from '../../types';
import { triggerHaptic } from '../../utils/haptics';
import {
  getSmartWhatsAppUrl,
  handleWhatsAppLinkClick,
  isMobileDevice,
} from '../../utils/whatsapp';
import {
  checkDeliveryRadiusByCoords,
  checkDeliveryRadiusByText,
  acquireHighAccuracyGps,
  reverseGeocodeCoords,
  checkGeolocationPermissionStatus,
  GURUGRAM_SECTOR_PRESETS,
  BRANCH_LOCATIONS,
  DeliveryCheckResult,
  MAX_DIRECT_DELIVERY_RADIUS_KM,
} from '../../utils/delivery';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  ArrowRight,
  Phone,
  MessageCircle,
  Navigation,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Loader2,
  Info,
  Compass,
  Crosshair,
} from 'lucide-react';

interface CartDrawerProps {
  settings: SiteSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ settings }) => {
  const {
    itemsList,
    totalCount,
    totalAmount,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
    clearCart,
    generateWhatsAppOrderMessage,
  } = useCart();

  const [notes, setNotes] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryResult, setDeliveryResult] = useState<DeliveryCheckResult | null>(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsProgressText, setGpsProgressText] = useState('Connecting to Phone GPS Satellites...');
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [permissionDeniedHelp, setPermissionDeniedHelp] = useState(false);
  const [allowSelfPickup, setAllowSelfPickup] = useState(false);

  // Sync address changes to delivery radius check
  const handleAddressChange = (val: string) => {
    setAddress(val);
    setGpsError(null);
    setPermissionDeniedHelp(false);
    if (!val.trim()) {
      setDeliveryResult(null);
      return;
    }
    const result = checkDeliveryRadiusByText(val);
    setDeliveryResult(result);
  };

  const handleSelectSector = (sectorName: string) => {
    triggerHaptic('selection');
    const newAddr = `${sectorName}, Gurugram`;
    setAddress(newAddr);
    setGpsError(null);
    setPermissionDeniedHelp(false);
    const result = checkDeliveryRadiusByText(sectorName);
    setDeliveryResult(result);
  };

  const handleDetectGps = async () => {
    triggerHaptic('light');
    setIsDetectingGps(true);
    setGpsError(null);
    setPermissionDeniedHelp(false);
    setGpsProgressText('Checking phone location permission & GPS sensor...');

    try {
      // 1. Check if permission was previously blocked
      const permStatus = await checkGeolocationPermissionStatus();
      if (permStatus === 'denied') {
        setIsDetectingGps(false);
        setPermissionDeniedHelp(true);
        setGpsError('Phone me location permission blocked hai. Kripya browser settings ya phone Quick Settings me Location on karke allow karein.');
        triggerHaptic('warning');
        return;
      }

      // 2. Acquire fresh, high-accuracy satellite GPS fix from hardware sensor
      const fix = await acquireHighAccuracyGps((msg) => {
        setGpsProgressText(msg);
      });

      // 3. Calculate distance to nearest outlet
      const result = checkDeliveryRadiusByCoords(fix.lat, fix.lng, fix.accuracyMeters);
      setDeliveryResult(result);

      // 4. Reverse geocode to nearest known street / sector
      setGpsProgressText('Resolving nearest Gurugram sector...');
      const resolvedAddress = await reverseGeocodeCoords(fix.lat, fix.lng);
      setAddress(resolvedAddress);

      triggerHaptic(result.status === 'eligible' ? 'success' : 'warning');
    } catch (err: any) {
      const rawMsg: string = err?.message || 'Could not fetch your location.';
      if (rawMsg.includes('PERMISSION_DENIED') || rawMsg.toLowerCase().includes('permission')) {
        setPermissionDeniedHelp(true);
      }
      const cleanMsg = rawMsg.replace(/^(PERMISSION_DENIED|POSITION_UNAVAILABLE|TIMEOUT):\s*/, '');
      setGpsError(cleanMsg);
      triggerHaptic('warning');
    } finally {
      setIsDetectingGps(false);
    }
  };

  if (!isCartDrawerOpen) return null;

  const freeDeliveryThreshold = 500;
  const isFreeDelivery = totalAmount >= freeDeliveryThreshold;
  const progressPercent = Math.min(100, Math.round((totalAmount / freeDeliveryThreshold) * 100));
  const amountNeeded = Math.max(0, freeDeliveryThreshold - totalAmount);

  const deliveryNote = deliveryResult
    ? `${deliveryResult.message} (${deliveryResult.status.toUpperCase()})`
    : allowSelfPickup
    ? 'Customer Self-Pickup / Dunzo Arranged'
    : undefined;

  const mapsPinUrl = deliveryResult?.mapsUrl;

  const handleWhatsAppCheckout = (e: React.MouseEvent<HTMLElement>) => {
    triggerHaptic('success');
    const orderMsg = generateWhatsAppOrderMessage(notes, address, deliveryNote, mapsPinUrl);
    handleWhatsAppLinkClick(e, settings.whatsappNumber, orderMsg);
  };

  const whatsappHref = getSmartWhatsAppUrl(
    settings.whatsappNumber,
    generateWhatsAppOrderMessage(notes, address, deliveryNote, mapsPinUrl)
  );

  const isOutOfRange = deliveryResult?.status === 'out_of_range';
  const isEligible = deliveryResult?.status === 'eligible';

  // Fallback links for Zomato / Swiggy
  const fallbackZomatoUrl =
    deliveryResult?.closestBranch?.zomatoUrl ||
    BRANCH_LOCATIONS[0].zomatoUrl ||
    'https://zomato.onelink.me/xqzv/gj35mxzd';

  const fallbackSwiggyUrl =
    deliveryResult?.closestBranch?.swiggyUrl ||
    BRANCH_LOCATIONS[0].swiggyUrl ||
    'https://www.swiggy.com/menu/759351?source=sharing';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Your Cart"
      className="fixed inset-0 z-50 overflow-hidden select-none"
    >
      {/* Backdrop */}
      <div
        onClick={() => {
          triggerHaptic('light');
          closeCartDrawer();
        }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity cursor-pointer"
      />

      {/* Drawer Container — 100% full width on mobile (no pl-4 offset), sleek 440px on tablet/desktop */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-auto max-w-full flex pl-0 sm:pl-6 pointer-events-none">
        <div className="w-full sm:w-[440px] max-w-full bg-[#0e0e0e] border-l border-white/10 shadow-2xl flex flex-col justify-between text-white animate-slide-in-right overflow-hidden pointer-events-auto">
          
          {/* Header */}
          <div className="p-3.5 sm:p-5 border-b border-white/10 bg-[#141414] flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#168B4F]/20 text-[#168B4F] flex items-center justify-center border border-[#168B4F]/40 shadow-sm shrink-0">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <h2 className="font-display font-extrabold text-base sm:text-lg text-white truncate">
                  Your Order ({totalCount})
                </h2>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="truncate">100% Pure Veg • Made Fresh</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                closeCartDrawer();
              }}
              aria-label="Close cart drawer"
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3.5 no-scrollbar">
            
            {/* 1. Free Delivery Banner with 3 km In-House Partner Info */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#141414] to-black border border-emerald-500/30 p-3.5 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between text-xs">
                <span className="font-display font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isFreeDelivery ? 'Free In-House Delivery Unlocked!' : 'Direct Delivery (Within 3 km)'}</span>
                </span>
                <span className="font-extrabold text-emerald-400">
                  {isFreeDelivery ? '₹0 Delivery' : `Add ₹${amountNeeded} more`}
                </span>
              </div>

              {/* Progress track */}
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Explicit 3 km Delivery Policy Note */}
              <div className="flex items-start gap-1.5 text-[11px] text-gray-300 bg-white/[0.03] p-2 rounded-xl border border-white/5">
                <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="leading-tight">
                  <strong className="text-white">Our 3 km Policy:</strong> In-house delivery riders deliver within{' '}
                  <span className="text-emerald-400 font-bold">3 km radius</span> of South City-1 &amp; Sector-40 outlets (Free on orders ₹500+). For locations beyond 3 km, order seamlessly via Zomato/Swiggy.
                </p>
              </div>
            </div>

            {/* 2. Items List */}
            {itemsList.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-white/5 text-gray-400 flex items-center justify-center mx-auto border border-white/10">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="font-display font-bold text-lg text-white">Your Cart is Empty</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Browse our mouthwatering dosas, uttapams, idlis, and filter coffee to add to your order.
                </p>
                <button
                  type="button"
                  onClick={closeCartDrawer}
                  className="mt-2 rounded-full bg-[#168B4F] px-5 py-2 text-xs font-extrabold uppercase tracking-wider text-white shadow-md hover:bg-emerald-600 transition cursor-pointer"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between pb-1 border-b border-white/5">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Selected Dishes
                  </span>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-[11px] font-semibold text-red-400 hover:text-red-300 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear Cart</span>
                  </button>
                </div>

                {itemsList.map(({ item, quantity }) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-[#141414] border border-white/10 p-2.5 sm:p-3 flex items-center gap-2.5 sm:gap-3 hover:border-white/20 transition-colors"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-neutral-900 border border-white/5 shrink-0 relative flex items-center justify-center">
                      {item.image && item.image.trim() !== '' ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1c1c1c] to-[#0f0f0f] flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-emerald-400/70" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-xs border border-white bg-black flex items-center justify-center shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#168B4F]" />
                        </div>
                        <h4 className="font-display font-extrabold text-xs sm:text-sm text-white truncate">
                          {item.name}
                        </h4>
                      </div>
                      <span className="font-display font-bold text-[11px] sm:text-xs text-emerald-400 block mt-0.5">
                        ₹{item.price} each
                      </span>
                    </div>

                    {/* Stepper */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <div className="h-7 px-1 rounded-full bg-black/60 border border-white/15 flex items-center gap-1 sm:gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label="Decrease quantity"
                          className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                        >
                          <Minus className="w-2.5 h-2.5 stroke-[3]" />
                        </button>
                        <span className="font-display font-black text-xs text-white min-w-[14px] text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label="Increase quantity"
                          className="w-5 h-5 rounded-full bg-[#168B4F] hover:bg-emerald-600 text-white flex items-center justify-center transition cursor-pointer"
                        >
                          <Plus className="w-2.5 h-2.5 stroke-[3]" />
                        </button>
                      </div>

                      <span className="font-display font-black text-xs text-white tracking-tight">
                        ₹{item.price * quantity}
                      </span>
                    </div>
                  </div>
                ))}

                {/* 3. Interactive Smart Delivery Radius Validator Card */}
                <div className="rounded-2xl bg-[#141414] border border-white/10 p-3 sm:p-3.5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label htmlFor="delivery-address" className="text-xs font-extrabold text-white flex items-center gap-1.5 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">Delivery Address (Gurugram)</span>
                    </label>

                    {/* High Precision GPS Detect Button */}
                    <button
                      type="button"
                      onClick={handleDetectGps}
                      disabled={isDetectingGps}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/35 transition disabled:opacity-50 cursor-pointer shadow-sm active:scale-95 shrink-0"
                    >
                      {isDetectingGps ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                          <span>Locating...</span>
                        </>
                      ) : (
                        <>
                          <Navigation className="w-3 h-3 text-emerald-400 fill-emerald-400/20" />
                          <span>Detect GPS</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Real-time GPS Acquisition progress indicator */}
                  {isDetectingGps && (
                    <div className="rounded-xl bg-emerald-950/60 border border-emerald-500/40 p-2.5 flex items-center gap-2 text-xs text-emerald-300 animate-pulse">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400 shrink-0" />
                      <span className="font-semibold text-[11px] truncate">{gpsProgressText}</span>
                    </div>
                  )}

                  {/* Input field */}
                  <input
                    id="delivery-address"
                    type="text"
                    value={address}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    placeholder="Enter your street address, sector, or landmark..."
                    className="w-full rounded-xl bg-black/50 border border-white/15 px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
                  />

                  {/* Permission Denied Help Card */}
                  {permissionDeniedHelp && (
                    <div className="rounded-xl bg-amber-950/70 border border-amber-500/50 p-3 text-xs text-amber-200 space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300">
                        <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Phone Location Permission Required:</span>
                      </div>
                      <ol className="list-decimal list-inside space-y-1 text-[11px] text-gray-300 leading-relaxed pl-1">
                        <li>Phone ke notification bar (Quick Settings) me <strong>Location / GPS</strong> on karein.</li>
                        <li>Browser ke top address bar me <strong>🔒 (Lock / Settings)</strong> icon tap karke <strong>Permissions &gt; Location</strong> ko <strong>Allow</strong> karein.</li>
                      </ol>
                      <div className="pt-1 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleDetectGps}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[10px] uppercase tracking-wider transition cursor-pointer"
                        >
                          Try Again
                        </button>
                        <span className="text-[10px] text-gray-400">ya neeche se sector chunein</span>
                      </div>
                    </div>
                  )}

                  {/* General GPS Error */}
                  {gpsError && !permissionDeniedHelp && (
                    <p className="text-[11px] text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>{gpsError}</span>
                    </p>
                  )}

                  {/* High Accuracy GPS Locked Badge */}
                  {deliveryResult?.coords && (
                    <div className="rounded-xl bg-emerald-950/50 border border-emerald-500/35 p-2.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-[11px] text-emerald-200 shadow-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <Crosshair className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
                        <div className="min-w-0">
                          <span className="font-bold text-white block text-xs">Exact Phone GPS Verified</span>
                          <span className="text-[10px] text-gray-300 font-mono block truncate">
                            {deliveryResult.coords.lat.toFixed(4)}° N, {deliveryResult.coords.lng.toFixed(4)}° E
                            {deliveryResult.coords.accuracyMeters !== undefined && (
                              <span className="text-emerald-300 ml-1.5 font-sans font-bold">
                                (±{deliveryResult.coords.accuracyMeters}m accuracy)
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                      {deliveryResult.mapsUrl && (
                        <a
                          href={deliveryResult.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300 hover:text-white bg-emerald-500/20 hover:bg-emerald-500/30 px-2.5 py-1 rounded-md transition shrink-0"
                        >
                          <span>Map Pin</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Quick Sector Selector Chips */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                      Quick Pick Your Sector (Direct 3 km Zone):
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar py-0.5">
                      {GURUGRAM_SECTOR_PRESETS.slice(0, 8).map((preset) => {
                        const isSelected = address.toLowerCase().includes(preset.name.toLowerCase());
                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => handleSelectSector(preset.name)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(22,139,79,0.5)]'
                                : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                            }`}
                          >
                            {preset.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic Status Result Banner */}
                  {deliveryResult && (
                    <div className="pt-1">
                      {isEligible ? (
                        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Within 3 km Direct Delivery Zone!</span>
                          </div>
                          <p className="text-[11px] text-gray-300">
                            {deliveryResult.distanceKm !== undefined && (
                              <span>Approx. <strong>{deliveryResult.distanceKm} km</strong> from {deliveryResult.closestBranch?.shortName || 'nearest outlet'}. </span>
                            )}
                            Our in-house delivery rider will deliver your meal fresh &amp; piping hot!
                          </p>
                        </div>
                      ) : isOutOfRange ? (
                        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/50 text-xs text-amber-200 space-y-2.5 shadow-md">
                          <div className="flex items-start gap-1.5 font-bold text-amber-300">
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <span>Address is Beyond 3 km Direct Rider Radius</span>
                              {deliveryResult.distanceKm !== undefined && (
                                <span className="block text-[11px] font-normal text-amber-200/80">
                                  Distance: ~{deliveryResult.distanceKm} km (Our rider limit is 3.0 km)
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-[11px] text-gray-300 leading-relaxed">
                            Don't worry! We deliver across all of Gurugram through our verified <strong>Zomato</strong> and <strong>Swiggy</strong> outlets:
                          </p>

                          {/* 1-Click Fallback Action Buttons */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            <a
                              href={fallbackZomatoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="interactive-press py-2 px-3 rounded-xl bg-[#E23744] hover:bg-[#c92a36] text-white font-bold text-[11px] uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-md"
                            >
                              <span>Order on Zomato</span>
                              <ExternalLink className="w-3 h-3 text-white/80" />
                            </a>

                            <a
                              href={fallbackSwiggyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="interactive-press py-2 px-3 rounded-xl bg-[#FC8019] hover:bg-[#e06f12] text-white font-bold text-[11px] uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-md"
                            >
                              <span>Order on Swiggy</span>
                              <ExternalLink className="w-3 h-3 text-white/80" />
                            </a>
                          </div>

                          {/* Self-pickup exception toggle */}
                          <div className="pt-2 border-t border-amber-500/20 flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="self-pickup-checkbox"
                              checked={allowSelfPickup}
                              onChange={(e) => setAllowSelfPickup(e.target.checked)}
                              className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 cursor-pointer"
                            />
                            <label htmlFor="self-pickup-checkbox" className="text-[11px] text-gray-300 cursor-pointer">
                              I will arrange my own pickup / Dunzo from the restaurant
                            </label>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* 4. Special Instructions */}
                <div>
                  <label htmlFor="order-notes" className="text-[11px] font-bold text-gray-300 block mb-1">
                    Special Cooking Instructions (Optional):
                  </label>
                  <textarea
                    id="order-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Extra crispy dosa, separate sambar, mild spicy..."
                    rows={2}
                    className="w-full rounded-xl bg-[#141414] border border-white/10 px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {itemsList.length > 0 && (
            <div className="p-3.5 sm:p-5 border-t border-white/10 bg-[#141414] space-y-3 pb-[calc(1.2rem+env(safe-area-inset-bottom,0px))]">
              {/* Bill Details */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-display font-bold text-white">₹{totalAmount}</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span>In-House Delivery</span>
                  <span className="font-display font-bold text-emerald-400">
                    {isFreeDelivery ? 'FREE (within 3 km)' : 'Standard (min ₹500 for Free)'}
                  </span>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="font-display font-black text-sm text-white">To Pay</span>
                  <span className="font-display font-black text-lg text-emerald-400">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              {/* Conditional Action Buttons */}
              {isOutOfRange && !allowSelfPickup ? (
                <div className="space-y-2">
                  <div className="text-center text-[11px] text-amber-300 font-semibold">
                    📍 Beyond 3 km: Complete order on your preferred app:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={fallbackZomatoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full rounded-xl bg-[#E23744] hover:bg-[#c92a36] active:scale-[0.98] py-2.5 px-2 text-white font-display font-black text-[11px] sm:text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 shadow-lg transition-all"
                    >
                      <span>Zomato</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                    <a
                      href={fallbackSwiggyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full rounded-xl bg-[#FC8019] hover:bg-[#e06f12] active:scale-[0.98] py-2.5 px-2 text-white font-display font-black text-[11px] sm:text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 shadow-lg transition-all"
                    >
                      <span>Swiggy</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>
                </div>
              ) : (
                /* Primary WhatsApp Order Button for Direct Delivery */
                <a
                  href={whatsappHref}
                  onClick={handleWhatsAppCheckout}
                  target={isMobileDevice() ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="w-full rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] py-3.5 px-3 sm:px-4 text-white font-display font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(37,211,102,0.4)] transition-all cursor-pointer text-center"
                >
                  <MessageCircle className="w-4.5 h-4.5 fill-current shrink-0" />
                  <span className="truncate">
                    {allowSelfPickup
                      ? 'Order for Self-Pickup on WhatsApp'
                      : 'Send Order via WhatsApp (3 km Rider)'}
                  </span>
                </a>
              )}

              {/* Secondary Call Restaurant Direct */}
              <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-gray-400">
                <span>Or call directly:</span>
                <a
                  href={`tel:+91${settings.phonePrimary}`}
                  className="font-bold text-white hover:text-emerald-400 underline flex items-center gap-1"
                >
                  <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>+91 {settings.phonePrimary}</span>
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
