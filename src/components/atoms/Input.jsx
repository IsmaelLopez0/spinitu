export default function Input({ label, name, errors, className, ...props }) {
  return (
    <div className="w-full">
      <label htmlFor={name} className="text-slate-500 mb-2 block text-sm">
        {label}
      </label>
      <input
        type="text"
        name={name}
        className={`p-3 rounded block mb-2 w-full border border-swirl-100 ${className}`}
        {...props}
      />
      {errors && errors[name] ? (
        <span className="text-red-500 text-xs">{errors[name].message}</span>
      ) : null}
    </div>
  );
}
