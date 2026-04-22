import './ListPage.css'

type Post = {
  id: number
  title: string
  body: string
  author: string
  date: string
  likes: number
  comments: number
}

const POSTS: Post[] = [
  {
    id: 1,
    title: '･ﾟ･ they all storm in like a wave •.° °•.° then they all go °•☆•',
    body: '오늘도 무대를 보면서 감탄했어요. 멤버들 에너지가 파도처럼 밀려와서 한순간도 눈을 못 떼겠어요.',
    author: 'blink_river',
    date: 'Apr 20, 2026',
    likes: 428,
    comments: 53,
  },
  {
    id: 2,
    title: '이번 콘셉트 사진 분위기 너무 좋아요',
    body: '색감이랑 스타일링이 다 완벽했어요. 다음 티저도 빨리 보고 싶어요.',
    author: 'rose_cloud',
    date: 'Apr 19, 2026',
    likes: 301,
    comments: 29,
  },
  {
    id: 3,
    title: '라이브 클립 다시 보기 무한 반복 중',
    body: '파트 바뀔 때마다 표정 연기가 진짜 레전드예요. 이어폰 필수입니다.',
    author: 'jisoo_day',
    date: 'Apr 18, 2026',
    likes: 267,
    comments: 41,
  },
]

function ListPage() {
  return (
    <main className="list-page">
      <header className="list-header">
        <h1>Community</h1>
        <p className="list-subtitle">
          Communicate with other people about anything.
        </p>
      </header>

      <section className="list-items">
        {POSTS.map((post) => (
          <article key={post.id} className="list-card">
            <div className="card-head">
              <div className="avatar" aria-hidden="true">
                {post.author[0].toUpperCase()}
              </div>
              <div>
                <p className="author">{post.author}</p>
                <p className="date">{post.date}</p>
              </div>
            </div>
            <h2 className="post-title">{post.title}</h2>
            <p className="post-body">{post.body}</p>
            <div className="card-actions">
              <span className="action-item">
                <svg className="action-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12.62 20.55 12 21.13l-.62-.58C6.1 15.76 2.5 12.4 2.5 8.29 2.5 5.01 5.06 2.5 8.25 2.5c1.8 0 3.53.85 4.62 2.2 1.09-1.35 2.82-2.2 4.62-2.2 3.19 0 5.75 2.51 5.75 5.79 0 4.11-3.6 7.47-8.88 12.26Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {post.likes}
              </span>
              <span className="action-item">
                <svg className="action-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M21 11.5c0 4.42-4.03 8-9 8a9.67 9.67 0 0 1-3.54-.66L3 20.5l1.65-4.05A7.56 7.56 0 0 1 3 11.5c0-4.42 4.03-8 9-8s9 3.58 9 8Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {post.comments}
              </span>
              <span className="action-item" aria-label="공유">
                <svg className="action-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M16 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.6 8.9l4.8-2.8m-4.8 7.9 4.8 2.8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            <div className="meta">
              <span>#BLACKPINK</span>
              <span>{post.date}</span>
            </div>
          </article>
        ))}
      </section>
      <a className="floating-write-button" href="/write" aria-label="게시글 작성">
        <svg
          className="floating-write-button-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12 5V19M5 12H19"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </main>
  )
}

export default ListPage
