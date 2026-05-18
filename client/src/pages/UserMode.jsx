import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMap, getRole, clearAuth, ApiError } from '../lib/api.js';
import LoginGate from '../components/LoginGate.jsx';
import MapCanvas from '../components/MapCanvas.jsx';
import PinModal from '../components/PinModal.jsx';

function Viewer() {
  const [map, setMap] = useState(null);
  const [error, setError] = useState('');
  const [visibleLayerIds, setVisibleLayerIds] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getMap()
      .then((data) => {
        if (cancelled) return;
        setMap(data);
        setVisibleLayerIds(
          data.layers.filter((l) => l.visible !== false).map((l) => l.id)
        );
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          clearAuth();
          window.location.reload();
        } else {
          setError(err.message || 'Failed to load map');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function toggleLayer(id) {
    setVisibleLayerIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    );
  }

  function logout() {
    clearAuth();
    window.location.reload();
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-rose-600">
        {error}
      </div>
    );
  }
  if (!map) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-500">
        Loading map…
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-slate-900">
      <header className="flex flex-wrap items-center gap-3 bg-slate-800 px-4 py-2 text-white">
        <h1 className="font-semibold">Interactive Map</h1>
        {map.layers.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wide text-slate-400">
              Layers
            </span>
            {map.layers.map((layer) => {
              const on = visibleLayerIds.includes(layer.id);
              return (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => toggleLayer(layer.id)}
                  className={`rounded-full px-3 py-1 text-sm transition ${
                    on
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {layer.name}
                </button>
              );
            })}
          </div>
        )}
        <div className="ml-auto flex items-center gap-3 text-sm">
          <span className="hidden text-slate-400 sm:inline">
            Scroll / pinch to zoom · drag to pan
          </span>
          <button
            type="button"
            onClick={logout}
            className="rounded bg-slate-700 px-3 py-1 hover:bg-slate-600"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <MapCanvas
          map={map}
          visibleLayerIds={visibleLayerIds}
          editable={false}
          onPinClick={setSelectedPin}
        />
      </main>

      {selectedPin && (
        <PinModal pin={selectedPin} onClose={() => setSelectedPin(null)} />
      )}
    </div>
  );
}

export default function UserMode() {
  const role = getRole();
  const authed = role === 'viewer' || role === 'admin';

  if (!authed) {
    return (
      <LoginGate
        mode="viewer"
        title="Interactive Map"
        subtitle="Enter the viewer password to explore the map."
        altLink={{ to: '/admin', label: 'Administrator? Sign in here →' }}
      />
    );
  }
  return <Viewer />;
}
