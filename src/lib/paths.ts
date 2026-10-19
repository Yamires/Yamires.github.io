export function href(path = "") {
  return `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export function artifactHref(path: string) {
  return /^https?:\/\//.test(path) ? path : href(path);
}
