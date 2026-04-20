import './WritePage.css'

function WritePage() {
  return (
    <main className="write-page">
      <header className="write-header">
        <h1>게시글 작성</h1>
        <a href="/list">목록으로</a>
      </header>
      <form className="write-form">
        <label>
          제목
          <input type="text" placeholder="제목을 입력하세요" />
        </label>
        <label>
          내용
          <textarea rows={10} placeholder="나누고 싶은 이야기를 적어주세요" />
        </label>
        <button type="button">등록</button>
      </form>
    </main>
  )
}

export default WritePage;
