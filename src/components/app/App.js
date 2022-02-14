import { MainPage, ComicsPage } from "../pages";
import AppHeader from "../appHeader/AppHeader";

const App = () => {
  return (
    <div className="app">
      <AppHeader />
      <main>
        <MainPage />
        <ComicsPage />
      </main>
    </div>
  );
};

export default App;
