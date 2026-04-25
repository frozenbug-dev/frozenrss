import {asc, desc, gt, lt, type Column, type ColumnBaseConfig, type ColumnDataType} from 'drizzle-orm'
import {type PgSelect} from 'drizzle-orm/pg-core'

export interface WithCursorOptions<
  TConfig extends ColumnBaseConfig<ColumnDataType, string> = ColumnBaseConfig<ColumnDataType, string>,
> {
  column: Column<TConfig>
  cursor?: TConfig['data']
  dir: 'asc' | 'desc'
  limit: number
}

export function withCursor<TSelect extends PgSelect, TConfig extends ColumnBaseConfig<ColumnDataType, string>>(
  qb: TSelect,
  options: WithCursorOptions<TConfig>
) {
  const {column, cursor, dir, limit} = options

  let query = qb.orderBy(dir === 'asc' ? asc(column) : desc(column))

  if (cursor != null) {
    const cond = dir === 'asc' ? gt : lt
    query = query.where(cond(column, cursor))
  }

  return query.limit(limit)
}

export interface CursorFilters<T> {
  limit?: number
  cursor?: T
  dir?: WithCursorOptions['dir']
}
