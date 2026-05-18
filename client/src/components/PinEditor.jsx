import { useState } from 'react';
import Modal from './Modal.jsx';

export default function PinEditor({ pin, layers, onSave, onDelete, onClose }) {
  const [form, setForm] = useState({
    title: pin.title || '',
    description: pin.description || '',
    imageUrl: pin.imageUrl || '',
    linkUrl: pin.linkUrl || '',
    layers: pin.layers || [],
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleLayer(id) {
    setForm((f) => ({
      ...f,
      layers: f.layers.includes(id)
        ? f.layers.filter((l) => l !== id)
        : [...f.layers, id],
    }));
  }

  function save() {
    onSave({ ...pin, ...form });
  }

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <h2 className="text-lg font-bold text-slate-800">Edit pin</h2>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Title
        </label>
        <input
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
        />

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Description <span className="text-slate-400">(Markdown supported)</span>
        </label>
        <textarea
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          rows={5}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm outline-none focus:border-indigo-500"
          placeholder="**Bold**, _italic_, [links](https://...), lists..."
        />

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Image URL <span className="text-slate-400">(optional)</span>
        </label>
        <input
          value={form.imageUrl}
          onChange={(e) => update('imageUrl', e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
          placeholder="https://..."
        />

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Link URL <span className="text-slate-400">(optional)</span>
        </label>
        <input
          value={form.linkUrl}
          onChange={(e) => update('linkUrl', e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
          placeholder="https://..."
        />

        <p className="mt-4 text-sm font-medium text-slate-700">Layers</p>
        {layers.length === 0 ? (
          <p className="mt-1 text-sm italic text-slate-400">
            No layers yet. Create a layer in the sidebar.
          </p>
        ) : (
          <div className="mt-1 flex flex-wrap gap-2">
            {layers.map((layer) => {
              const checked = form.layers.includes(layer.id);
              return (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => toggleLayer(layer.id)}
                  className={`rounded-full border px-3 py-1 text-sm transition ${
                    checked
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                  }`}
                >
                  {layer.name}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onDelete(pin.id)}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
          >
            Delete pin
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
