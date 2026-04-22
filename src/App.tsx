import HomePage from "./components/HomePage.tsx";
import ListPage from "./components/ListPage.tsx";
import SigninPage from "./components/SigninPage.tsx";
import SignupPage from "./components/SignupPage.tsx";
import WritePage from "./components/WritePage.tsx";

function App() {
  const path = window.location.pathname;

  if (path === "/list") {
    return <ListPage />;
  }

  if (path === "/write") {
    return <WritePage />;
  }

  if (path === "/signup") {
    return <SignupPage />;
  }

  if (path === "/signin") {
    return <SigninPage />;
  }

  return <HomePage />;
}

export default App;
