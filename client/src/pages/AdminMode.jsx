import { useEffect, useRef, useState } from 'react';
import {
  getMap,
  saveMap,
  uploadImage,
  getRole,
  clearAuth,
  ApiError,
} from '../lib/api.js';
import LoginGate from '../components/LoginGate.jsx';
import MapCanvas from '../components/MapCanvas.jsx';
import PinEditor from '../components/PinEditor.jsx';

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function Editor() {
  const [map, setMap] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('saved'); // saved | saving | error
  const [addMode, setAddMode] = useState(false);
  const [editingPin, setEditingPin] = useState(null);
  const [newLayerName, setNewLayerName] = useState('');
  const firstRun = useRef(true);

  useEffect(() => {
    getMap()
      .then(setMap)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          clearAuth();
          window.location.reload();
        } else {
          setError(err.message || 'Failed to load map');
        }
      });
  }, []);

  // Debounced auto-save whenever the map changes.
  useEffect(() => {
    if (!map) return undefined;
    if (firstRun.current) {
      firstRun.current = false;
      return undefined;
    }
    setStatus('saving');
    const timer = setTimeout(() => {
      saveMap(map)
        .then(() => setStatus('saved'))
        .catch(() => setStatus('error'));
    }, 600);
    return () => clearTimeout(timer);
  }, [map]);

  const visibleLayerIds = map
    ? map.layers.filter((l) => l.visible !== false).map((l) => l.id)
    : [];

  async function handleUpload(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      setStatus('saving');
      const { path } = await uploadImage(file);
      setMap((m) => ({ ...m, backgroundImage: path }));
    } catch (err) {
      setError(err.message || 'Upload failed');
      setStatus('error');
    }
  }

  function addLayer() {
    const name = newLayerName.trim();
    if (!name) return;
    setMap((m) => ({
      ...m,
      layers: [...m.layers, { id: uid('layer'), name, visible: true }],
    }));
    setNewLayerName('');
  }

  function toggleLayer(id) {
    setMap((m) => ({
      ...m,
      layers: m.layers.map((l) =>
        l.id === id ? { ...l, visible: l.visible === false } : l
      ),
    }));
  }

  function deleteLayer(id) {
    setMap((m) => ({
      ...m,
      layers: m.layers.filter((l) => l.id !== id),
      pins: m.pins.map((p) => ({
        ...p,
        layers: (p.layers || []).filter((l) => l !== id),
      })),
    }));
  }

  function placePin({ x, y }) {
    const pin = {
      id: uid('pin'),
      x,
      y,
      title: 'New Pin',
      description: '',
      imageUrl: '',
      linkUrl: '',
      layers: [],
    };
    setMap((m) => ({ ...m, pins: [...m.pins, pin] }));
    setAddMode(false);
    setEditingPin(pin);
  }

  function movePin(id, { x, y }) {
    setMap((m) => ({
      ...m,
      pins: m.pins.map((p) => (p.id === id ? { ...p, x, y } : p)),
    }));
  }

  function savePin(updated) {
    setMap((m) => ({
      ...m,
      pins: m.pins.map((p) => (p.id === updated.id ? updated : p)),
    }));
    setEditingPin(null);
  }

  function deletePin(id) {
    setMap((m) => ({ ...m, pins: m.pins.filter((p) => p.id !== id) }));
    setEditingPin(null);
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
        Loading editor…
      </div>
    );
  }

  const statusLabel =
    status === 'saving'
      ? 'Saving…'
      : status === 'error'
        ? 'Save failed'
        : 'All changes saved';

  return (
    <div className="flex h-screen flex-col">
      {/* Edit-mode banner */}
      <div className="flex items-center gap-3 bg-amber-400 px-4 py-1.5 text-sm font-semibold text-amber-950">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-amber-900" />
          EDIT MODE
        </span>
        <span className="font-normal">
          You are editing the map. Changes are saved automatically.
        </span>
        <span
          className={`ml-auto font-normal ${
            status === 'error' ? 'text-rose-700' : 'text-amber-900'
          }`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="flex w-72 flex-col overflow-y-auto border-r border-slate-200 bg-white p-4">
          <h1 className="text-lg font-bold text-slate-800">Admin Panel</h1>

          {/* Background image */}
          <section className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Background image
            </p>
            <label className="mt-2 block cursor-pointer rounded-lg border border-dashed border-slate-300 px-3 py-3 text-center text-sm text-slate-600 hover:border-indigo-400 hover:bg-indigo-50">
              {map.backgroundImage ? 'Replace image' : 'Upload image'}
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
            </label>
          </section>

          {/* Pins */}
          <section className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Pins ({map.pins.length})
            </p>
            <button
              type="button"
              disabled={!map.backgroundImage}
              onClick={() => setAddMode((v) => !v)}
              className={`mt-2 w-full rounded-lg px-3 py-2 text-sm font-semibold transition disabled:opacity-50 ${
                addMode
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {addMode ? 'Click the map to place… (cancel)' : '+ Add pin'}
            </button>
            <p className="mt-1 text-xs text-slate-400">
              Drag any pin to reposition it. Click a pin to edit.
            </p>
          </section>

          {/* Layers */}
          <section className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Layers
            </p>
            <div className="mt-2 flex gap-2">
              <input
                value={newLayerName}
                onChange={(e) => setNewLayerName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addLayer()}
                placeholder="New layer name"
                className="min-w-0 flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={addLayer}
                className="rounded-lg bg-slate-800 px-3 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Add
              </button>
            </div>

            <ul className="mt-3 space-y-1.5">
              {map.layers.length === 0 && (
                <li className="text-xs italic text-slate-400">
                  No layers yet.
                </li>
              )}
              {map.layers.map((layer) => (
                <li
                  key={layer.id}
                  className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1.5"
                >
                  <button
                    type="button"
                    onClick={() => toggleLayer(layer.id)}
                    title={
                      layer.visible === false ? 'Show layer' : 'Hide layer'
                    }
                    className={`flex h-5 w-9 items-center rounded-full px-0.5 transition ${
                      layer.visible === false ? 'bg-slate-300' : 'bg-indigo-500'
                    }`}
                  >
                    <span
                      className={`h-4 w-4 rounded-full bg-white shadow transition ${
                        layer.visible === false ? '' : 'translate-x-4'
                      }`}
                    />
                  </button>
                  <span className="flex-1 truncate text-sm text-slate-700">
                    {layer.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteLayer(layer.id)}
                    className="text-xs text-slate-400 hover:text-rose-600"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-slate-400">
              Toggle a layer off to preview the user experience.
            </p>
          </section>

          <button
            type="button"
            onClick={logout}
            className="mt-auto rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Log out
          </button>
        </aside>

        {/* Map */}
        <main className="flex-1 overflow-hidden">
          <MapCanvas
            map={map}
            visibleLayerIds={visibleLayerIds}
            editable
            addMode={addMode}
            onPlacePin={placePin}
            onPinMove={movePin}
            onPinClick={setEditingPin}
          />
        </main>
      </div>

      {editingPin && (
        <PinEditor
          pin={editingPin}
          layers={map.layers}
          onSave={savePin}
          onDelete={deletePin}
          onClose={() => setEditingPin(null)}
        />
      )}
    </div>
  );
}

export default function AdminMode() {
  const authed = getRole() === 'admin';
  if (!authed) {
    return (
      <LoginGate
        mode="admin"
        title="Admin Sign-in"
        subtitle="Enter the admin password to edit the map."
        buttonClass="bg-amber-500 hover:bg-amber-600"
        altLink={{ to: '/', label: '← Back to the map' }}
      />
    );
  }
  return <Editor />;
}
