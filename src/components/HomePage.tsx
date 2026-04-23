import './HomePage.css'

function HomePage() {
  return (
    <main className="home-page">
      <h1>게시판 데모</h1><br/>
      <p>
        회원가입 화면은 <code>signup</code> 에서 확인할 수 있어요.<br/><br/>
        로그인 화면은 <code>signin</code> 에서 확인할 수 있어요.<br/><br/>
        목록 화면은 <code>list</code> 에서 확인할 수 있어요.<br/><br/>
        로그인을 안하면 <code>list</code>를 확인할 수 없어요.
      </p>
      <a href="/signup">signUp 이동</a><br/><br/>
      <a href="/signin">signIn 이동</a><br/><br/>
      <a href="/list">list 이동</a>
    </main>
  )
}

export default HomePage
