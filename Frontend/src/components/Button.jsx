export default function Button({ loading, children, ...props }) {
  return (
    <button
      disabled={loading}
      className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition"
      {...props}
    >
      {loading ? 'Please wait...' : children}
    </button>
  );
}
