import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import "./SignupPage.css";

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "알 수 없는 오류가 발생했습니다.";
}

function isUsersPrimaryKeyConflict(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as { code?: string; message?: string };
  return (
    e.code === "23505" &&
    typeof e.message === "string" &&
    e.message.includes("users_pkey")
  );
}

function formatSignupFailureAlert(error: unknown): string {
  const raw = getErrorMessage(error);
  if (/email rate limit exceeded|over_email_send_rate_limit|429/i.test(raw)) {
    return (
      "가입/인증 메일 발송 한도에 걸렸습니다. 같은 이메일로 반복 가입을 시도했거나, 짧은 시간에 요청이 많을 때 발생합니다.\n\n" +
        "잠시(수 분~수십 분) 뒤에 다시 시도하세요. 로컬 개발 중이면 Supabase 대시보드 → Authentication → Providers → Email에서 " +
        "「이메일 확인(Confirm email)」을 끄면 메일 발송이 줄어듭니다."
    );
  }
  return `회원가입에 실패했습니다.\n\n${raw}`;
}

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || !nickname.trim()) {
      alert("이메일, 비밀번호, 닉네임을 모두 입력해 주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      const normalizedEmail = email.trim().toLowerCase();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: password.trim(),
        options: {
          data: { nickname: nickname.trim() },
        },
      });

      if (signUpError) throw signUpError;
      if (!data.user) {
        throw new Error("가입 응답에 사용자 정보가 없습니다.");
      }

      // 이메일 인증을 켜 두면 가입 직후 JWT가 없어 RLS 때문에 users insert가 실패합니다.
      // 이 경우 public.users 행은 DB 트리거(auth.users 생성 시)로 넣는 것을 권장합니다.
      if (!data.session) {
        alert(
          "가입 처리되었습니다. 이메일에 온 링크로 인증한 뒤 로그인해 주세요.\n\n" +
            "(인증 전에는 세션이 없어 앱에서 users 프로필을 만들 수 없습니다. Supabase SQL로 auth 가입 시 users를 자동 삽입하는 트리거를 두거나, Authentication에서 이메일 확인을 끄면 가입 직후 프로필이 생성됩니다.)",
        );
        window.location.href = "/signin";
        return;
      }

      // 트리거가 이미 users 행을 넣었거나, upsert ignoreDuplicates가 API에서 기대대로 안 먹는 경우가 있어
      // PK 중복(23505 / users_pkey)만 "이미 있음"으로 처리합니다. (닉네임 유일 등 다른 23505는 그대로 실패)
      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        nickname: nickname.trim(),
      });

      if (profileError && !isUsersPrimaryKeyConflict(profileError)) {
        throw profileError;
      }

      alert("회원가입이 완료되었습니다.");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert(formatSignupFailureAlert(error));
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
            autoComplete="new-password"
          />
        </label>

        <label>
          닉네임
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="표시할 닉네임"
            autoComplete="nickname"
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
