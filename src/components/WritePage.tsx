import "./WritePage.css";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type CurrentUser = {
  id: string;
  nickname: string;
  email: string;
};

const WritePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setIsLoadingUser(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("id,nickname")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error(error);
        alert("users 프로필을 찾지 못했습니다. 회원가입이 완료되었는지 확인해 주세요.");
        setIsLoadingUser(false);
        return;
      }

      setCurrentUser({
        id: data.id as string,
        nickname: data.nickname as string,
        email: session.user.email ?? "",
      });
      setIsLoadingUser(false);
    };

    void loadCurrentUser();
  }, []);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (isLoadingUser) {
        alert(
          "로그인 사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.",
        );
        return;
      }
      if (!currentUser) {
        alert("로그인 후 프로필이 있어야 글을 작성할 수 있습니다.");
        return;
      }

      if (!title.trim() || !content.trim()) {
        alert("제목과 내용을 입력해 주세요.");
        return;
      }

      const { data: post, error } = await supabase
        .from("post")
        .insert({
          author_id: currentUser.id,
          title: title.trim(),
          content: content.trim(),
        })
        .select("id")
        .single();

      if (error) throw error;
      // window.location.href = `/post/${post.id}`;
      window.location.href = `/list`;
    } catch (error) {
      console.error(error);
      alert("게시글 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <main className="write-page">
      <header className="write-header">
        <h1>게시글 작성</h1>
        <a href="/list">목록으로</a>
      </header>
      <form className="write-form">
        <label>
          작성자
          <input
            type="text"
            value={
              currentUser
                ? `${currentUser.nickname} (${currentUser.email})`
                : ""
            }
            placeholder={
              isLoadingUser ? "로그인 사용자 확인 중..." : "로그인이 필요합니다"
            }
            readOnly
          />
        </label>
        <label>
          제목
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title ?? ""}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          내용
          <textarea
            rows={10}
            placeholder="나누고 싶은 이야기를 적어주세요"
            value={content ?? ""}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>
        <button type="button" onClick={handleSubmit}>
          등록
        </button>
      </form>
    </main>
  );
};

export default WritePage;
