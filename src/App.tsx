import { useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from './lib/supabase'
import './App.css'

const TABLE_OPTIONS = [
  'users',
  'tag',
  'post_tag',
  'post_like',
  'post',
  'comment_like',
  'comment',
]

function App() {
  const [tableName, setTableName] = useState('users')
  const [rows, setRows] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLoadTable = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: queryError } = await supabase
      .from(tableName.trim())
      .select('*')
      .limit(20)

    if (queryError) {
      setRows([])
      setError(queryError.message)
      setLoading(false)
      return
    }

    setRows(data ?? [])
    setLoading(false)
  }

  return (
    <main style={{ maxWidth: 840, margin: '40px auto', padding: '0 16px' }}>
      <h1>Supabase Table Tester</h1>

      <form onSubmit={handleLoadTable} style={{ display: 'flex', gap: 8 }}>
        <select
          value={tableName}
          onChange={(event) => setTableName(event.target.value)}
          style={{ flex: 1, padding: 10 }}
        >
          {TABLE_OPTIONS.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <button type="submit" disabled={loading}>
          {loading ? '불러오는 중...' : '조회'}
        </button>
      </form>

      {error && (
        <p style={{ color: 'tomato', marginTop: 12 }}>
          에러: {error}
        </p>
      )}

      <p style={{ marginTop: 12, opacity: 0.8 }}>
        최대 20개 행을 JSON 형태로 보여줍니다.
      </p>

      <pre
        style={{
          marginTop: 12,
          padding: 16,
          borderRadius: 12,
          background: '#111',
          color: '#e7e7e7',
          overflowX: 'auto',
        }}
      >
        {JSON.stringify(rows, null, 2)}
      </pre>
    </main>
  )
}

export default App
