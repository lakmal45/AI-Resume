export function DeleteModal({ open, onClose, onConfirm, loading }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30">
      <div className="bg-base-card border border-base-border rounded-xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-base font-semibold mb-2">Delete resume?</h2>
        <p className="text-sm text-base-subt mb-4">
          This action cannot be undone. Are you sure you want to delete this
          resume?
        </p>
        <div className="flex justify-end gap-2 text-sm">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-base-border hover:bg-base-bg"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
