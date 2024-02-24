export default function Card({ data, children }) {
  return (
    <div className="flex flex-col w-full rounded-lg shadow-md bg-white">
      {data.image ? (
        <div className="bg-gray-200 p-4 rounded-t-lg">
          <img
            src={data.image}
            alt={data.title}
            className="w-full h-40 object-cover rounded-md"
          />
        </div>
      ) : null}
      <div className="p-4">
        <h3 className="text-lg font-medium mb-2">{data.title}</h3>
        {data.description ? (
          <p className="text-gray-500 mb-4">{data.description}</p>
        ) : null}
        {children}
      </div>
    </div>
  );
}
