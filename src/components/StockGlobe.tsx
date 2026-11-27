import createGlobe, { type COBEOptions, type Marker } from "cobe";
import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring } from "motion/react";

const TAIWAN_LAT = 23.7;
const TAIWAN_LNG = 121;
const FOCUS_PHI = Math.PI - ((TAIWAN_LNG * Math.PI) / 180 - Math.PI / 2);
const FOCUS_THETA = (TAIWAN_LAT * Math.PI) / 180;
const GLOBE_SCALE = 2.6;

export interface StockPlace {
  city: string;
  latitude: number;
  longitude: number;
  quantity: number;
}

function heatColor(quantity: number, min: number, max: number): [number, number, number] {
  const span = max - min;
  const t = span <= 0 ? 1 : (quantity - min) / span;
  const mix = 0.18 + t * 0.82;
  const light = [198, 206, 240];
  const dark = [6, 3, 141];
  return [
    (light[0] + (dark[0] - light[0]) * mix) / 255,
    (light[1] + (dark[1] - light[1]) * mix) / 255,
    (light[2] + (dark[2] - light[2]) * mix) / 255,
  ];
}

function project(lat: number, lng: number, phi: number, theta: number, width: number) {
  const dLng = ((lng - TAIWAN_LNG) * Math.PI) / 180 - (phi - FOCUS_PHI);
  const dLat = ((lat - TAIWAN_LAT) * Math.PI) / 180 - (theta - FOCUS_THETA);
  const radius = (width / 2) * GLOBE_SCALE * 0.86;
  const x = width / 2 + dLng * Math.cos((TAIWAN_LAT * Math.PI) / 180) * radius;
  const y = width / 2 - dLat * radius;
  if (Math.hypot(x - width / 2, y - width / 2) > radius * 0.92) return null;
  return { x, y };
}

export function StockGlobe({ places }: { places: StockPlace[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const widthRef = useRef(0);
  const pointerInteracting = useRef<number | null>(null);
  const pointerMovement = useRef(0);
  const markerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [hover, setHover] = useState<number | null>(null);
  const r = useMotionValue(0);
  const rs = useSpring(r, { mass: 1, damping: 30, stiffness: 100 });
  const quantities = places.map((place) => place.quantity);
  const min = Math.min(...quantities);
  const max = Math.max(...quantities);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const gl = canvas.getContext("webgl2", { alpha: true, antialias: true, preserveDrawingBuffer: true })
      ?? canvas.getContext("webgl", { alpha: true, antialias: true, preserveDrawingBuffer: true });
    if (!gl) return;

    const onResize = () => {
      widthRef.current = canvas.offsetWidth;
    };
    onResize();
    window.addEventListener("resize", onResize);

    const markers: Marker[] = places.map((place) => ({
      location: [place.latitude, place.longitude],
      size: 0.012 + ((place.quantity - min) / Math.max(max - min, 1)) * 0.018,
      color: heatColor(place.quantity, min, max),
    }));

    const config: COBEOptions = {
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      devicePixelRatio: 2,
      phi: FOCUS_PHI,
      theta: FOCUS_THETA,
      dark: 0,
      diffuse: 1.15,
      mapSamples: 16000,
      mapBrightness: 7,
      mapBaseBrightness: 0,
      baseColor: [0.96, 0.97, 0.98],
      markerColor: [6 / 255, 3 / 255, 141 / 255],
      glowColor: [1, 1, 1],
      scale: GLOBE_SCALE,
      markers,
      context: { alpha: true, antialias: true, preserveDrawingBuffer: true },
      onRender: () => {},
    };

    let globe: ReturnType<typeof createGlobe> | null = null;
    try {
      globe = createGlobe(canvas, {
        ...config,
        onRender: (state) => {
          state.phi = FOCUS_PHI + rs.get();
          state.theta = FOCUS_THETA;
          state.scale = GLOBE_SCALE;
          state.width = widthRef.current * 2;
          state.height = widthRef.current * 2;
          const width = widthRef.current;
          const left = (wrap.offsetWidth - width) / 2;
          const top = (wrap.offsetHeight - width) / 2;
          places.forEach((place, index) => {
            const node = markerRefs.current[index];
            if (!node) return;
            const point = project(place.latitude, place.longitude, state.phi, FOCUS_THETA, width);
            if (!point) {
              node.style.opacity = "0";
              return;
            }
            node.style.opacity = "1";
            node.style.transform = `translate(${left + point.x}px, ${top + point.y}px) translate(-50%, -50%)`;
          });
        },
      });
    } catch {
      return () => window.removeEventListener("resize", onResize);
    }

    const show = window.setTimeout(() => {
      canvas.style.opacity = "1";
    }, 0);

    return () => {
      window.clearTimeout(show);
      globe?.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [max, min, places, rs]);

  function drag(clientX: number) {
    if (pointerInteracting.current === null) return;
    const delta = clientX - pointerInteracting.current;
    pointerMovement.current = delta;
    r.set(r.get() + delta / 1400);
  }

  return (
    <div ref={wrapRef} className="stock-globe">
      <canvas
        ref={canvasRef}
        className="stock-globe-canvas"
        onPointerDown={(event) => {
          pointerInteracting.current = event.clientX;
          if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
        }}
        onMouseMove={(event) => drag(event.clientX)}
        onTouchMove={(event) => {
          if (event.touches[0]) drag(event.touches[0].clientX);
        }}
      />
      {places.map((place, index) => (
        <button
          key={place.city}
          type="button"
          ref={(node) => {
            markerRefs.current[index] = node;
          }}
          className="stock-marker"
          aria-label={`${place.city} ${place.quantity}`}
          onMouseEnter={() => setHover(index)}
          onMouseLeave={() => setHover((current) => (current === index ? null : current))}
          onFocus={() => setHover(index)}
          onBlur={() => setHover((current) => (current === index ? null : current))}
        >
          <span className="stock-marker-dot" />
          {hover === index ? <span className="tag stock-marker-tag">{place.quantity}</span> : null}
        </button>
      ))}
    </div>
  );
}
