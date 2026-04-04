const TABS = ['Profile', 'Password', 'Preferences'];

export default function SettingsTabs({ active, onChange }) {
  return (
    <div className="flex border-b border-gray-200 mb-6">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-5 py-2.5 text-sm font-medium transition border-b-2 -mb-px ${
            active === tab
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
