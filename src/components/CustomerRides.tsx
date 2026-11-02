import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Car, 
  MapPin, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  Phone, 
  Star, 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldCheck, 
  Share2, 
  MessageSquare,
  Compass,
  Zap
} from 'lucide-react';

export const CustomerRides: React.FC = () => {
  const { activeRides, setRideHailingStay, listings, bookRide } = useApp();

  // Selected ride to view in tracking mode
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);

  // Animation Progress state (0 to 100%)
  const [progress, setProgress] = useState<number>(28);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Fallback demo ride if activeRides is empty
  const defaultDemoRide = activeRides[0] || {
    id: 'RIDE-ZM-8921',
    destinationStayId: listings[0]?.id || 'lst-1',
    destinationStayTitle: listings[0]?.title || 'Zambezi River Safari Lodge & Luxury Chalets',
    pickupLocation: 'Kenneth Kaunda International Airport (KKIA), Lusaka',
    dropoffLocation: `${listings[0]?.title || 'Zambezi River Safari Lodge'}, Mfuwe Riverbank`,
    rideType: 'Uber Safari 4x4' as const,
    estimatedFareZMW: 380,
    distanceKm: 22,
    durationMins: 28,
    status: 'arriving' as const,
    driverName: 'Kabwe Chileshe',
    vehicleModel: 'Toyota Fortuner 4x4 (Silver)',
    licensePlate: 'ALB 4492 ZM',
    driverRating: 4.95,
    estimatedArrivalMins: 4
  };

  const currentRide = activeRides.find(r => r.id === selectedRideId) || defaultDemoRide;

  // Real-time animation loop simulating vehicle motion along map coordinates
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          return 98; // Arrived
        }
        return prev + 0.35 * speedMultiplier;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier]);

  // Compute animated vehicle coordinates along a multi-segment Zambian road curve
  // Route goes from Pickup (KKIA / Airport Road) -> Roundabout -> Great East Road -> Destination Stay
  const calculateVehiclePosition = (pct: number) => {
    const t = Math.max(0, Math.min(100, pct)) / 100;
    
    // Waypoints for the route
    const p0 = { x: 80, y: 340 };  // Pickup point (bottom-left)
    const p1 = { x: 220, y: 310 }; // Airport Roundabout
    const p2 = { x: 380, y: 160 }; // Great East Interchange
    const p3 = { x: 540, y: 220 }; // City Bypass curve
    const p4 = { x: 700, y: 90 };  // Destination Stay (top-right)

    let currentX: number, currentY: number, angleDeg: number;

    if (t < 0.3) {
      const segT = t / 0.3;
      currentX = p0.x + (p1.x - p0.x) * segT;
      currentY = p0.y + (p1.y - p0.y) * segT;
      angleDeg = Math.atan2(p1.y - p0.y, p1.x - p0.x) * (180 / Math.PI);
    } else if (t < 0.6) {
      const segT = (t - 0.3) / 0.3;
      currentX = p1.x + (p2.x - p1.x) * segT;
      currentY = p1.y + (p2.y - p1.y) * segT;
      angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
    } else if (t < 0.85) {
      const segT = (t - 0.6) / 0.25;
      currentX = p2.x + (p3.x - p2.x) * segT;
      currentY = p2.y + (p3.y - p2.y) * segT;
      angleDeg = Math.atan2(p3.y - p2.y, p3.x - p2.x) * (180 / Math.PI);
    } else {
      const segT = (t - 0.85) / 0.15;
      currentX = p3.x + (p4.x - p3.x) * segT;
      currentY = p3.y + (p4.y - p3.y) * segT;
      angleDeg = Math.atan2(p4.y - p3.y, p4.x - p3.x) * (180 / Math.PI);
    }

    return { x: currentX, y: currentY, angle: angleDeg };
  };

  const vehiclePos = calculateVehiclePosition(progress);

  // Dynamic metrics based on progress
  const remainingDistanceKm = Math.max(0.2, (currentRide.distanceKm * (1 - progress / 100))).toFixed(1);
  const remainingMins = Math.max(1, Math.round(currentRide.durationMins * (1 - progress / 100)));
  const currentSpeedKmH = progress >= 97 ? 0 : Math.round(48 + Math.sin(progress) * 12);

  const handleShareStatus = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner & Quick Trigger */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-amber-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Live Ride & Transport Tracking (FR-10)
            </h2>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live GPS Simulation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time telemetry and dispatch navigation connecting Zambian hubs with your accommodations
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setRideHailingStay(listings[0])}
            className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs transition-colors"
          >
            Dispatch Another Ride
          </button>
        </div>
      </div>

      {/* Main Split View: Animated Vector Map & Telemetry Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Real-Time SVG Map Viewport */}
        <div className="lg:col-span-8 bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl flex flex-col">
          
          {/* Map Top Bar with Quick Controls */}
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold font-mono">
                <Compass className="w-4 h-4 animate-spin [animation-duration:8s]" />
                <span>GPS: Great East Road corridor, Lusaka</span>
              </div>
              <span className="text-slate-600">|</span>
              <span className="tabular-nums font-mono text-[11px] text-slate-400">
                Speed: <strong className="text-white">{currentSpeedKmH} km/h</strong>
              </span>
            </div>

            {/* Play/Pause & Speed Simulator Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setSpeedMultiplier(speedMultiplier === 1 ? 2.5 : 1)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-colors ${
                  speedMultiplier > 1 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                title="Toggle 2.5x simulation speed"
              >
                {speedMultiplier}x
              </button>
              <button
                onClick={() => setProgress(5)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                title="Reset Route Position"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative flex-1 min-h-[380px] sm:min-h-[440px] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 p-4 flex items-center justify-center overflow-hidden">
            
            {/* Ambient Map Grid & Topographic lines */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>

            {/* Watermark / Roads */}
            <svg 
              viewBox="0 0 800 420" 
              className="w-full h-full max-h-[460px] select-none"
            >
              <defs>
                {/* Linear gradient for completed vs upcoming route */}
                <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="60%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>

                {/* Drop shadow filter for vehicle */}
                <filter id="carGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Secondary decorative roads */}
              <path d="M40,120 L760,120" stroke="#1e293b" strokeWidth="6" />
              <path d="M40,280 L760,280" stroke="#1e293b" strokeWidth="6" />
              <path d="M220,20 L220,400" stroke="#1e293b" strokeWidth="5" />
              <path d="M540,20 L540,400" stroke="#1e293b" strokeWidth="5" />
              
              {/* Secondary road labels */}
              <text x="230" y="50" fill="#475569" fontSize="10" fontFamily="sans-serif">Chilimbulu Rd</text>
              <text x="550" y="50" fill="#475569" fontSize="10" fontFamily="sans-serif">Addis Ababa Dr</text>
              <text x="60" y="112" fill="#475569" fontSize="10" fontFamily="sans-serif">Kafue Arterial Link</text>
              <text x="60" y="272" fill="#475569" fontSize="10" fontFamily="sans-serif">Independence Ave</text>

              {/* Primary Guided Highway Track (Full Route Line) */}
              <path 
                id="main-track"
                d="M80,340 Q220,310 380,160 T540,220 T700,90" 
                stroke="#334155" 
                strokeWidth="8" 
                strokeLinecap="round"
                fill="none" 
              />

              {/* Active Route Colored Path */}
              <path 
                d="M80,340 Q220,310 380,160 T540,220 T700,90" 
                stroke="url(#routeGradient)" 
                strokeWidth="4" 
                strokeLinecap="round"
                strokeDasharray="8 6"
                fill="none" 
              />

              {/* Pickup Point Pin (KKIA / Origin) */}
              <g transform="translate(80, 340)">
                <circle r="14" fill="#10b981" fillOpacity="0.2" className="animate-ping" />
                <circle r="8" fill="#10b981" />
                <circle r="3" fill="#ffffff" />
                <rect x="-60" y="16" width="120" height="22" rx="4" fill="#0f172a" fillOpacity="0.9" stroke="#10b981" strokeWidth="1" />
                <text x="0" y="31" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  Pickup: Airport
                </text>
              </g>

              {/* Destination Stay Pin */}
              <g transform="translate(700, 90)">
                <circle r="16" fill="#f59e0b" fillOpacity="0.25" className="animate-ping" />
                <circle r="9" fill="#f59e0b" />
                <circle r="3.5" fill="#000000" />
                <rect x="-70" y="-32" width="140" height="24" rx="5" fill="#0f172a" fillOpacity="0.9" stroke="#f59e0b" strokeWidth="1" />
                <text x="0" y="-17" fill="#fde68a" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  Destination: {currentRide.destinationStayTitle.slice(0, 16)}...
                </text>
              </g>

              {/* Live Moving Vehicle Marker (Rotates along velocity direction) */}
              <g 
                transform={`translate(${vehiclePos.x}, ${vehiclePos.y}) rotate(${vehiclePos.angle})`}
                filter="url(#carGlow)"
              >
                {/* Vehicle shadow and halo */}
                <ellipse rx="18" ry="11" fill="#000000" fillOpacity="0.5" />
                <ellipse rx="14" ry="8" fill="#f59e0b" />
                {/* Windshield */}
                <rect x="-4" y="-5" width="8" height="10" rx="2" fill="#0f172a" />
                {/* Headlights beams */}
                <polygon points="12,-6 32,-12 32,12 12,6" fill="#fef08a" fillOpacity="0.3" />
                {/* Front grill */}
                <rect x="11" y="-4" width="2" height="8" rx="1" fill="#ffffff" />
                {/* Tail lights */}
                <rect x="-14" y="-5" width="2" height="3" fill="#ef4444" />
                <rect x="-14" y="2" width="2" height="3" fill="#ef4444" />
              </g>

              {/* Live Telemetry Bubble following the car */}
              <g transform={`translate(${vehiclePos.x}, ${vehiclePos.y - 32})`}>
                <rect x="-42" y="-14" width="84" height="20" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                <text x="0" y="0" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  {(currentRide.driverName || 'Kabwe').split(' ')[0]} · {remainingDistanceKm}km
                </text>
              </g>
            </svg>

            {/* Bottom In-Map HUD overlay */}
            <div className="absolute bottom-3 left-4 right-4 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                <span className="text-slate-300 font-medium">
                  {progress < 40 
                    ? 'Driver navigating Airport arterial road toward pickup' 
                    : progress < 85 
                    ? 'In transit via Great East Road Expressway' 
                    : 'Approaching stay gates and reception checkpoint'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-[11px] font-mono text-slate-400 tabular-nums">{Math.round(progress)}% Complete</span>
                <div className="w-32 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Side: Driver, Fare & Trip Controls */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Real-Time ETA Card */}
          <div className="bg-gradient-to-br from-amber-600 to-amber-700 text-white p-5 rounded-3xl shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
                Estimated Arrival
              </span>
              <span className="text-xs font-mono font-bold bg-amber-800/60 px-2 py-0.5 rounded">
                Live ETA
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tight tabular-nums">
                {remainingMins}
              </span>
              <span className="text-lg font-semibold text-amber-100">Minutes</span>
            </div>

            <p className="text-xs text-amber-100/90 leading-relaxed">
              Driver {currentRide.driverName} is on schedule in {currentRide.vehicleModel}.
            </p>

            <div className="pt-2 border-t border-amber-500/50 flex justify-between text-xs">
              <span>Distance to Go:</span>
              <span className="font-bold tabular-nums font-mono">{remainingDistanceKm} km</span>
            </div>
          </div>

          {/* Driver Profile & Vehicle Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center font-bold text-amber-800 dark:text-amber-300 text-base">
                  {(currentRide.driverName || 'Driver').charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {currentRide.driverName || 'Assigned Driver'}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{currentRide.driverRating}</span>
                    <span>· 1,420 Zambian trips</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="tel:+260968452210"
                  className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xs transition-colors"
                  title="Call Driver"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/260968452210?text=Hello%20driver,%20I%20am%20tracking%20my%20ride%20on%20Lama%20Kords%20App."
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center shadow-xs transition-colors"
                  title="WhatsApp Driver"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Vehicle & Plate Specs */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Vehicle:</span>
                <span className="font-bold text-slate-900 dark:text-white">{currentRide.vehicleModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Plate Number:</span>
                <span className="font-mono font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded">
                  {currentRide.licensePlate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ride Class:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{currentRide.rideType}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Total Fare:</span>
                <span className="font-bold text-amber-600 tabular-nums">
                  ZMW {currentRide.estimatedFareZMW} (Mobile Money / Cash)
                </span>
              </div>
            </div>

            {/* Safety & Share Button */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleShareStatus}
                className="flex-1 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Link Copied!' : 'Share Trip Status'}</span>
              </button>
            </div>
          </div>

          {/* Destination Stay Quick Info */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Destination Property</span>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{currentRide.destinationStayTitle}</h4>
            <p className="text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{currentRide.dropoffLocation}</span>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
