import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import "./SigninPage.css";

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("이메일과 비밀번호를 입력해 주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) throw error;

      alert("로그인되었습니다.");
      window.location.href = "/list";
    } catch (error) {
      console.error(error);
      alert("로그인에 실패했습니다. 이메일·비밀번호와 이메일 인증 여부를 확인해 주세요.");
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
          이메일
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label>
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
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
