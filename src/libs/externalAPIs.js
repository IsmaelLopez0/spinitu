{
  email: "kjklf";
}

const getQueryStringParams = (query = {}) =>
  Object.entries(query)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

const baseURL = process.env.NEXT_PUBLIC_API;

export async function genericFetch(params = {}) {
  const { url, method } = params;
  if ([url, method].includes(undefined)) {
    console.log("Falló");
  }
  const query = getQueryStringParams(params.query);
  const fullURL = `${baseURL}${url}?${query}`;
  const res = await fetch(fullURL, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...params?.headers,
    },
  });
  const data = await res.json();
  data.body = JSON.parse(data.body);
  delete data.headers;
  return data;
}
