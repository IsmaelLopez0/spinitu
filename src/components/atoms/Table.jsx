export default function Table({ title, headers, data, Actions, ...props }) {
  return (
    <div className="relative overflow-x-auto bg-white tremor-card ring-1 ring-black/10 rounded-tremor-default sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 rtl:text-right">
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 rtl:text-right">
          {title}
          {props.caption ? (
            <p className="mt-1 text-sm font-normal text-gray-500 ">
              {props.caption}
            </p>
          ) : null}
        </caption>
        <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-50 ">
          <tr>
            {headers.map((header) => (
              <th
                key={header.key}
                scope="col"
                className={`px-6 py-3 text-center text-xs ${header.class ?? ''}`}
              >
                {header.title}
              </th>
            ))}
            {Actions ? (
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {data.map((item, row) => (
            <tr key={`${item.id}-${row}`} className="bg-white border-b ">
              {headers.map(({ key }, col) => {
                const valueData = item[key];
                return col === 0 ? (
                  <th
                    key={`${key}-${col}`}
                    scope="row"
                    className="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap"
                  >
                    {valueData}
                  </th>
                ) : (
                  <td key={`${key}-${col}`} className="px-6 py-4 text-center">
                    {valueData}
                  </td>
                );
              })}
              {Actions ? <Actions item={item} /> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
