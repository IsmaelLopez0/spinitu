export default function Card({ data, children }) {
  return (
    <div className="flex flex-col w-full bg-white rounded-lg shadow-md">
      {data.image ? (
        <div className="p-4 bg-gray-200 rounded-t-lg">
          <img
            src={data.image}
            alt={data.title}
            className="object-cover w-full h-40 rounded-md"
          />
        </div>
      ) : null}
      <div className="p-4">
        <h3 className="mb-2 text-lg font-medium">{data.title}</h3>
        {data.description ? (
          <p className="mb-4 text-sm text-gray-500">{data.description}</p>
        ) : null}
        {children}
      </div>
    </div>
  );
}
