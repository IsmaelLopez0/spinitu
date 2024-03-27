export default function Input({ label, name, errors, className, ...props }) {
  return (
    <div className="w-full">
      <label htmlFor={name} className="block mb-2 text-sm text-slate-500">
        {label}
      </label>
      <input
        type="text"
        name={name}
        className={`p-3 rounded block mb-2 w-full border border-swirl-100 ${className}`}
        {...props}
      />
      {errors && errors[name] ? (
        <span className="text-xs text-red-500">{errors[name].message}</span>
      ) : null}
    </div>
  );
}
