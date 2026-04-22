import HomePage from "./components/HomePage.tsx";
import ListPage from "./components/ListPage.tsx";
import WritePage from "./components/WritePage.tsx";

function App() {
  const path = window.location.pathname;

  if (path === "/list") {
    return <ListPage />;
  }

  if (path === "/write") {
    return <WritePage />;
  }

  return <HomePage />;
}

export default App;
