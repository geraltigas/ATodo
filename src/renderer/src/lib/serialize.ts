export const to_json = (obj: unknown): string => {
  let tmp = JSON.stringify(obj)
  let res = tmp.replace(/"/g, '\'')
  return res
}

export const to_obj = (str: string): unknown => {
  if (str === null || str === '') {
    return null
  }
  let tmp = str.replace(/'/g, '"')
  let res = JSON.parse(tmp)
  return res
}
