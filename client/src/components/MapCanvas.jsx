import { useEffect, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

function clamp(v) {
  return Math.min(100, Math.max(0, v));
}

function pinIsVisible(pin, visibleLayerIds) {
  if (!pin.layers || pin.layers.length === 0) return true;
  return pin.layers.some((id) => visibleLayerIds.includes(id));
}

function PinMarker({ pin, editable, onClick, onDragStart }) {
  return (
    <div
      className="group absolute z-10"
      style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: 'translate(-50%, -50%)' }}
    >
      <button
        type="button"
        onPointerDown={(e) => {
          if (editable) {
            e.stopPropagation();
            onDragStart();
          }
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={`h-5 w-5 rounded-full border-2 border-white bg-rose-500 shadow-lg ring-rose-300 transition hover:scale-125 hover:bg-rose-400 hover:ring-4 ${
          editable ? 'cursor-move' : 'cursor-pointer'
        }`}
        aria-label={pin.title || 'Map pin'}
      />
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs font-medium text-white shadow group-hover:block">
        {pin.title || 'Untitled pin'}
      </div>
    </div>
  );
}

export default function MapCanvas({
  map,
  visibleLayerIds,
  editable = false,
  addMode = false,
  onPlacePin,
  onPinClick,
  onPinMove,
}) {
  const imgRef = useRef(null);
  const movedRef = useRef(false);
  const [dragId, setDragId] = useState(null);

  const bg = map.backgroundImage ? `/${map.backgroundImage}` : null;
  const visiblePins = map.pins.filter((p) => pinIsVisible(p, visibleLayerIds));

  function pctFromEvent(e) {
    const rect = imgRef.current.getBoundingClientRect();
    return {
      x: clamp(((e.clientX - rect.left) / rect.width) * 100),
      y: clamp(((e.clientY - rect.top) / rect.height) * 100),
    };
  }

  useEffect(() => {
    if (!dragId) return undefined;
    function move(e) {
      movedRef.current = true;
      onPinMove(dragId, pctFromEvent(e));
    }
    function up() {
      setDragId(null);
    }
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [dragId]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleImageClick(e) {
    if (editable && addMode) {
      onPlacePin(pctFromEvent(e));
    }
  }

  function handlePinClick(pin) {
    if (movedRef.current) {
      movedRef.current = false;
      return;
    }
    onPinClick(pin);
  }

  if (!bg) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-200 text-slate-500">
        <div className="text-center">
          <p className="text-lg font-medium">No map image yet</p>
          <p className="text-sm">
            {editable
              ? 'Upload a background image to get started.'
              : 'The administrator has not set up the map yet.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-slate-200">
      <TransformWrapper
        minScale={0.5}
        maxScale={8}
        centerOnInit
        wheel={{ step: 0.15 }}
        doubleClick={{ disabled: true }}
        panning={{ disabled: addMode || dragId !== null }}
      >
        <TransformComponent
          wrapperStyle={{ width: '100%', height: '100%' }}
          contentStyle={{ width: '100%', height: '100%' }}
        >
          <div className="flex h-full w-full items-center justify-center">
            <div className="relative select-none">
              <img
                ref={imgRef}
                src={bg}
                alt="Interactive map"
                draggable={false}
                onClick={handleImageClick}
                className={`block max-h-[100vh] w-auto ${
                  addMode ? 'cursor-crosshair' : ''
                }`}
              />
              {visiblePins.map((pin) => (
                <PinMarker
                  key={pin.id}
                  pin={pin}
                  editable={editable}
                  onClick={() => handlePinClick(pin)}
                  onDragStart={() => setDragId(pin.id)}
                />
              ))}
            </div>
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
