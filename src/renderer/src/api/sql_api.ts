// export type sql_api = {
//   init_database: (file_name: string) => Promise<boolean>
//   check_database: (file_name: string) => Promise<boolean>
//   select: (sql: string) => Promise<any[]>
//   rt_bool: (sql: string) => Promise<boolean>
//   sqls_rt_bool: (sqls: string[]) => Promise<boolean>
//   DB_FILE: string
//   DB_INIT_SQL_FILE: string
// }

export class sql_api {
  public static init_database(file_name: string): Promise<boolean> {
    // @ts-ignore
    return window.sql.init_database(file_name)
  }

  public static check_database(file_name: string): Promise<boolean> {
    // @ts-ignore
    return window.sql.check_database(file_name)
  }

  public static select(sql: string): Promise<any[]> {
    // @ts-ignore
    return window.sql.select(sql)
  }

  public static rt_bool(sql: string): Promise<boolean> {
    // @ts-ignore
    return window.sql.rt_bool(sql)
  }

  public static sqls_rt_bool(sqls: string[]): Promise<boolean> {
    // @ts-ignore
    return window.sql.sqls_rt_bool(sqls)
  }

  // @ts-ignore
  public static DB_FILE: string = window.sql.DB_FILE
  // @ts-ignore
  public static DB_INIT_SQL_FILE: string = window.sql.DB_INIT_SQL_FILE
}

