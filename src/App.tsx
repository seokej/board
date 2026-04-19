import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from './lib/supabase'
import './App.css'

type PostRow = {
  id: string
  title: string | null
  content: string | null
  created_at?: string | null
  updated_at?: string | null
  [key: string]: unknown
}

function App() {
  const [posts, setPosts] = useState<PostRow[]>([])
  const [selectedPostId, setSelectedPostId] = useState('')
  const [titleInput, setTitleInput] = useState('')
  const [contentInput, setContentInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadPosts = async () => {
    setLoading(true)
    setError('')

    const { data, error: queryError } = await supabase
      .from('post')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (queryError) {
      setError(queryError.message)
      setLoading(false)
      return
    }

    const normalized = (data as PostRow[] | null) ?? []
    setPosts(normalized)
    setSelectedPostId((current) => {
      if (current && normalized.some((row) => row.id === current)) {
        return current
      }
      return normalized[0]?.id ?? ''
    })
    setLoading(false)
  }

  useEffect(() => {
    void loadPosts()
  }, [])

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId) ?? posts[0],
    [posts, selectedPostId],
  )

  useEffect(() => {
    if (!selectedPost) {
      setTitleInput('')
      setContentInput('')
      return
    }
    setTitleInput(selectedPost.title ?? '')
    setContentInput(selectedPost.content ?? '')
  }, [selectedPostId, selectedPost])

  const resetForm = () => {
    setSelectedPostId('')
    setTitleInput('')
    setContentInput('')
  }

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!titleInput.trim() || !contentInput.trim()) {
      setError('제목과 내용을 입력해 주세요.')
      return
    }
    setSaving(true)
    setError('')

    const { error: insertError } = await supabase.from('post').insert({
      title: titleInput.trim(),
      content: contentInput.trim(),
    })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    await loadPosts()
    setSaving(false)
  }

  const handleUpdate = async () => {
    if (!selectedPost?.id) {
      setError('수정할 게시글을 선택해 주세요.')
      return
    }
    setSaving(true)
    setError('')

    const { error: updateError } = await supabase
      .from('post')
      .update({
        title: titleInput.trim(),
        content: contentInput.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', selectedPost.id)

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }

    await loadPosts()
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!selectedPost?.id) {
      setError('삭제할 게시글을 선택해 주세요.')
      return
    }
    const confirmed = window.confirm('선택한 게시글을 삭제할까요?')
    if (!confirmed) {
      return
    }

    setSaving(true)
    setError('')

    const { error: deleteError } = await supabase
      .from('post')
      .delete()
      .eq('id', selectedPost.id)

    if (deleteError) {
      setError(deleteError.message)
      setSaving(false)
      return
    }

    resetForm()
    await loadPosts()
    setSaving(false)
  }

  const dateText = (iso: string | null | undefined) => {
    if (!iso) return '-'
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return '-'
    return date.toLocaleString('ko-KR')
  }

  return (
    <main className="board-page">
      <header className="board-header">
        <h1>LE SSERAFIM 팬 게시판</h1>
        <p>Supabase `post` 테이블과 연동된 CRUD 게시판입니다.</p>
      </header>

      <section className="board-layout">
        <aside className="board-list">
          <h2>게시글 목록</h2>
          <button
            type="button"
            className="new-post-button"
            onClick={resetForm}
            disabled={saving}
          >
            + 새 글 작성
          </button>
          {loading && <p className="status-text">불러오는 중...</p>}
          {!loading && posts.length === 0 && (
            <p className="status-text">게시글이 없습니다.</p>
          )}
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <button
                  type="button"
                  className={post.id === selectedPost?.id ? 'is-active' : ''}
                  onClick={() => setSelectedPostId(post.id)}
                >
                  <strong>{post.title ?? '(제목 없음)'}</strong>
                  <span>
                    {dateText(post.created_at)} · ID: {post.id}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <article className="board-detail">
          <h2>{selectedPost ? '게시글 수정' : '새 게시글 작성'}</h2>
          <div className="meta">
            <span>작성일: {dateText(selectedPost?.created_at)}</span>
            <span>수정일: {dateText(selectedPost?.updated_at)}</span>
          </div>

          <form className="editor-form" onSubmit={handleCreate}>
            <label>
              제목
              <input
                value={titleInput}
                onChange={(event) => setTitleInput(event.target.value)}
                placeholder="제목을 입력하세요."
                disabled={saving}
              />
            </label>
            <label>
              내용
              <textarea
                value={contentInput}
                onChange={(event) => setContentInput(event.target.value)}
                placeholder="내용을 입력하세요."
                rows={8}
                disabled={saving}
              />
            </label>

            <div className="editor-actions">
              <button type="submit" disabled={saving}>
                {saving ? '처리 중...' : '등록'}
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={saving || !selectedPost}
              >
                수정
              </button>
              <button
                type="button"
                className="danger"
                onClick={handleDelete}
                disabled={saving || !selectedPost}
              >
                삭제
              </button>
            </div>
          </form>

          {error && <p className="error-text">에러: {error}</p>}
        </article>
      </section>
    </main>
  )
}

export default App
