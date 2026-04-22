import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import "./SigninPage.css";

const SigninPage = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loginId.trim() || !password.trim()) {
      alert("아이디와 비밀번호를 입력해 주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      const { data, error } = await supabase
        .from("users")
        .select("id,login_id,nickname")
        .eq("login_id", loginId.trim())
        .eq("password", password.trim())
        .single();

      if (error) throw error;
      localStorage.setItem("board_user", JSON.stringify(data));

      alert("로그인되었습니다.");
      window.location.href = "/write";
    } catch (error) {
      console.error(error);
      alert("로그인에 실패했습니다. 계정 정보를 확인해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="signin-page">
      <header className="signin-header">
        <h1>로그인</h1>
        <a href="/">홈으로</a>
      </header>

      <form className="signin-form" onSubmit={handleSignin}>
        <label>
          아이디(login_id)
          <input
            type="text"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            placeholder="아이디를 입력하세요"
          />
        </label>

        <label>
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </main>
  );
};

export default SigninPage;
