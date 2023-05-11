
//trim query
export function trimQuery(query: object): object {
  Object.keys(query).forEach(key => {
    if (query[key] === null || query[key] === '') delete query[key]
    else query[key] = query[key].trim()
  })  
  return query
}