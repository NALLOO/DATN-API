//trim query
export function trimQuery(query: object): object {
  Object.keys(query).forEach((key) => {
    if (query[key] === null || query[key] === '' || query[key] === undefined)
      delete query[key];
    else query[key] = query[key].trim();
  });
  return query;
}
