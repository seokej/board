import './HomePage.css'

function HomePage() {
  return (
    <main className="home-page">
      <h1>게시판 데모</h1>
      <p>
        목록 화면은 <code>/list</code> 경로에서 확인할 수 있어요.
      </p>
      <a href="/list">/list 이동</a>
    </main>
  )
}

export default HomePage
