import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import "./SignupPage.css";

const SignupPage = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loginId.trim() || !password.trim() || !nickname.trim()) {
      alert("아이디, 비밀번호, 닉네임을 모두 입력해 주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase.from("users").insert({
        login_id: loginId.trim(),
        password: password.trim(),
        nickname: nickname.trim(),
      });

      if (error) throw error;

      alert("회원가입이 완료되었습니다.");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("회원가입에 실패했습니다. 입력값 또는 정책(RLS)을 확인해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="signup-page">
      <header className="signup-header">
        <h1>회원가입</h1>
        <a href="/">홈으로</a>
      </header>

      <form className="signup-form" onSubmit={handleSignup}>
        <label>
          아이디(login_id)
          <input
            type="text"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            placeholder="example@example.com"
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

        <label>
          닉네임
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="표시할 닉네임"
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "가입 중..." : "가입하기"}
        </button>
      </form>
    </main>
  );
};

export default SignupPage;
