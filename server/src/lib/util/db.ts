import {asc, desc, gt, lt, sql, type Column, type SQL, type Table} from 'drizzle-orm'
import {type PgSelect} from 'drizzle-orm/pg-core'
import {getTableColumns} from 'drizzle-orm/utils'

export function withCursor<TSelect extends PgSelect>(qb: TSelect, options: WithCursorOptions) {
  const {columns, dir, limit} = options
  const orderFn = dir === 'asc' ? asc : desc

  let query = qb.orderBy(...columns.map(({column}) => orderFn(column as Column)))

  if (limit > 0) {
    query = query.limit(limit)
  }

  if (options.cursor != null) {
    const values = decodeCursor(options.cursor)
    const cond = dir === 'asc' ? gt : lt

    if (columns.length === 1) {
      query = query.where(cond(columns[0].column as Column, values[0]))
    } else {
      const coalesced = columns.map(({column, default: def}) =>
        def != null ? sql`coalesce(${column}, ${def})` : column
      )
      const cursorValues = columns.map(({default: def}, i) => (def != null && values[i] === 'null' ? def : values[i]))

      query = query.where(
        cond(
          sql`(${sql.join(coalesced, sql`, `)})`,
          sql`(${sql.join(
            cursorValues.map(v => sql`${v}`),
            sql`, `
          )})`
        )
      )
    }
  }

  return query
}

const DEFAULT_ENCODER = (value: unknown): string =>
  value == null ? 'null'
    : value instanceof Date ? value.toISOString()
    : String(value)

export interface ColumnConfig {
  column: Column | SQL
  /** Default value for nulls (e.g., epoch for nullable timestamps). */
  default?: unknown
  /** Custom encoder for the cursor value. Defaults to `String()` or `'null'`. */
  encoder?: (value: unknown) => string
}

export interface WithCursorOptions {
  columns: [ColumnConfig, ...ColumnConfig[]]
  cursor?: string
  dir: 'asc' | 'desc'
  limit: number
}

function buildColumnKeyMap(table: Table): Map<Column, string> {
  const map = new Map<Column, string>()
  for (const [key, col] of Object.entries(getTableColumns(table))) {
    map.set(col as Column, key)
  }
  return map
}

export function encodeCursor(
  row: Record<string, unknown>,
  columns: ColumnConfig[],
  table: Table,
): string {
  const keyMap = buildColumnKeyMap(table)
  return columns
    .map(({column, encoder, default: def}) => {
      const name = keyMap.get(column as Column) ?? (column as Column).name
      const rawValue = row[name]
      const value = rawValue == null && def != null ? def : rawValue
      return (encoder ?? DEFAULT_ENCODER)(value)
    })
    .join('::')
}

export function decodeCursor(cursor: string): string[] {
  return cursor.split('::')
}

export interface CursorFilters<T> {
  limit?: number
  cursor?: T
  dir?: WithCursorOptions['dir']
}
