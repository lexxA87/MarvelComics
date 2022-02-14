import { useState } from "react";

import AppBanner from "../appBanner/AppBanner";
import ComicsList from "../comicsList/ComicsList";

const ComicsPage = () => {
  const [selectedComic, setComic] = useState(null);

  const onSelectedComic = (id) => {
    setComic(id);
  };

  return (
    <>
      <AppBanner />
      <ComicsList onSelectedComic={onSelectedComic} />
    </>
  );
};

export default ComicsPage;
