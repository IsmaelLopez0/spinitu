export default function Table({ title, headers, data, ...props }) {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 rtl:text-right ">
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white rtl:text-right ">
          {title}
          {props.caption ? (
            <p className="mt-1 text-sm font-normal text-gray-500 ">
              {props.caption}
            </p>
          ) : null}
        </caption>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
          <tr>
            {headers.map((header) => (
              <th
                key={header.key}
                scope="col"
                className={`px-6 py-3 ${header.class ?? ''}`}
              >
                {header.title}
              </th>
            ))}
            {props.actions ? (
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {data.map((item, row) => (
            <tr key={item.id ?? row} className="bg-white border-b ">
              {headers.map(({ key }, col) => {
                const valueData = item[key];
                return col === 0 ? (
                  <th
                    key={key}
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                  >
                    {valueData}
                  </th>
                ) : (
                  <td key={key} className="px-6 py-4">
                    {valueData}
                  </td>
                );
              })}
              {props.actions ? (
                <td className="px-6 py-4 text-right">{props.actions}</td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
