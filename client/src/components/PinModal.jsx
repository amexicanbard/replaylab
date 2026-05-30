import ReactMarkdown from 'react-markdown';
import Modal from './Modal.jsx';

export default function PinModal({ pin, onClose }) {
  if (!pin) return null;
  const imageSrc = pin.imageUrl
    ? pin.imageUrl.startsWith('http') || pin.imageUrl.startsWith('/')
      ? pin.imageUrl
      : `/${pin.imageUrl}`
    : '';

  return (
    <Modal onClose={onClose}>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
        aria-label="Close"
      >
        ✕
      </button>

      {imageSrc && (
        <img
          src={imageSrc}
          alt={pin.title}
          className="max-h-64 w-full rounded-t-xl object-cover"
        />
      )}

      <div className="p-6">
        <h2 className="pr-8 text-xl font-bold text-slate-800">
          {pin.title || 'Untitled'}
        </h2>

        <div className="md-content mt-3 text-sm text-slate-600">
          {pin.description ? (
            <ReactMarkdown>{pin.description}</ReactMarkdown>
          ) : (
            <p className="italic text-slate-400">No description.</p>
          )}
        </div>

        {pin.linkUrl && (
          <a
            href={pin.linkUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Open link →
          </a>
        )}
      </div>
    </Modal>
  );
}
