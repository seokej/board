import "./ListPage.css";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

type Post = {
  id: number;
  title: string;
  body: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
  tags?: string[];
};

type PostRow = {
  id: number;
  title: string;
  content: string;
  author_id: number;
  created_at: string;
};

type UserRow = {
  id: number;
  nickname: string;
};

type SessionUser = {
  id: number;
};

function ListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likingPostId, setLikingPostId] = useState<number | null>(null);
  const [likedPostIds, setLikedPostIds] = useState<number[]>([]);
  const hasRedirectedRef = useRef(false);

  const getSessionUserId = () => {
    const savedUser = localStorage.getItem("board_user");
    if (!savedUser) return null;

    try {
      const parsedUser = JSON.parse(savedUser) as SessionUser;
      return Number(parsedUser.id) || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleLike = async (postId: number) => {
    const sessionUserId = getSessionUserId();
    if (!sessionUserId) {
      alert("로그인 후 좋아요를 누를 수 있습니다.");
      return;
    }

    if (likingPostId === postId) return;

    try {
      setLikingPostId(postId);
      const alreadyLiked = likedPostIds.includes(postId);

      if (alreadyLiked) {
        const { error } = await supabase
          .from("post_like")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", sessionUserId);

        if (error) throw error;

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, likes: Math.max(0, post.likes - 1) }
              : post,
          ),
        );
        setLikedPostIds((prev) => prev.filter((id) => id !== postId));
      } else {
        const { error } = await supabase.from("post_like").insert({
          post_id: postId,
          user_id: sessionUserId,
        });

        if (error) throw error;

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post,
          ),
        );
        setLikedPostIds((prev) =>
          prev.includes(postId) ? prev : [...prev, postId],
        );
      }
    } catch (error: unknown) {
      console.error(error);
      const duplicateError =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "23505";

      if (duplicateError) {
        alert("이미 좋아요를 누른 게시글입니다.");
      } else {
        alert("좋아요/해제 처리에 실패했습니다.");
      }
    } finally {
      setLikingPostId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("board_user");
    window.location.href = "/";
  };

  useEffect(() => {
    const loadPosts = async () => {
      const sessionUserId = getSessionUserId();
      if (!sessionUserId) {
        if (hasRedirectedRef.current) return;
        hasRedirectedRef.current = true;
        alert("로그인이 필요합니다");
        window.location.href = "/signin";
        return;
      }

      const { data: postRows, error: postError } = await supabase
        .from("post")
        .select("id,title,content,author_id,created_at")
        .order("created_at", { ascending: false });

      if (postError) {
        console.error(postError);
        setIsLoading(false);
        return;
      }

      const safePostRows = (postRows ?? []) as PostRow[];
      const authorIds = [...new Set(safePostRows.map((row) => row.author_id))];

      let userMap: Record<number, string> = {};
      if (authorIds.length > 0) {
        const { data: userRows, error: userError } = await supabase
          .from("users")
          .select("id,nickname")
          .in("id", authorIds);

        if (userError) {
          console.error(userError);
        } else {
          userMap = ((userRows ?? []) as UserRow[]).reduce(
            (acc, user) => {
              acc[user.id] = user.nickname;
              return acc;
            },
            {} as Record<number, string>,
          );
        }
      }

      const { data: likeRows, error: likeError } = await supabase
        .from("post_like")
        .select("post_id,user_id");

      if (likeError) {
        console.error(likeError);
      }

      const likeCountMap = (
        (likeRows ?? []) as Array<{ post_id: number }>
      ).reduce(
        (acc, likeRow) => {
          const count = acc[likeRow.post_id] ?? 0;
          acc[likeRow.post_id] = count + 1;
          return acc;
        },
        {} as Record<number, number>,
      );

      const currentUserId = getSessionUserId();
      const myLikedPostIds =
        currentUserId === null
          ? []
          : ((likeRows ?? []) as Array<{ post_id: number; user_id?: number }>)
              .filter((row) => row.user_id === currentUserId)
              .map((row) => row.post_id);

      const mappedPosts: Post[] = safePostRows.map((row) => ({
        id: row.id,
        title: row.title,
        body: row.content,
        author: userMap[row.author_id] ?? `user#${row.author_id}`,
        date: new Date(row.created_at).toLocaleDateString("ko-KR"),
        likes: likeCountMap[row.id] ?? 0,
        comments: 0,
      }));

      setPosts(mappedPosts);
      setLikedPostIds(myLikedPostIds);
      setIsLoading(false);
    };

    void loadPosts();
  }, []);

  if (!getSessionUserId()) {
    return null;
  }

  return (
    <main className="list-page">
      <header className="list-header">
        <div className="list-header-top">
          <h1>Community</h1>
          <button
            type="button"
            className="list-logout-button"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
        <p className="list-subtitle">
          Communicate with other people about anything.
        </p>
      </header>

      <section className="list-items">
        {isLoading && (
          <p className="list-empty">게시글을 불러오는 중입니다...</p>
        )}
        {!isLoading && posts.length === 0 && (
          <p className="list-empty">아직 등록된 게시글이 없습니다.</p>
        )}
        {posts.map((post) => (
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
              <button
                className={`action-item action-button ${likedPostIds.includes(post.id) ? "action-liked" : ""}`}
                type="button"
                onClick={() => void handleLike(post.id)}
                disabled={likingPostId === post.id}
                aria-label="좋아요"
              >
                <svg
                  className="action-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M12.62 20.55 12 21.13l-.62-.58C6.1 15.76 2.5 12.4 2.5 8.29 2.5 5.01 5.06 2.5 8.25 2.5c1.8 0 3.53.85 4.62 2.2 1.09-1.35 2.82-2.2 4.62-2.2 3.19 0 5.75 2.51 5.75 5.79 0 4.11-3.6 7.47-8.88 12.26Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {post.likes}
              </button>
              <span className="action-item">
                <svg
                  className="action-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
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
                <svg
                  className="action-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
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
              <span>{post.tags?.join(", ")}</span>
              <span>{post.date}</span>
            </div>
          </article>
        ))}
      </section>
      <a
        className="floating-write-button"
        href="/write"
        aria-label="게시글 작성"
      >
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
  );
}

export default ListPage;
