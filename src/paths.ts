export function publicAsset(path: `/${string}`) {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL.slice(0, -1)
    : import.meta.env.BASE_URL

  return base === '' ? path : `${base}${path}`
}
