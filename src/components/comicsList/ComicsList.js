import { useState, useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Link } from "react-router-dom";
import useMarvelService from "../../services/MarvelService";

import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import "./comicsList.scss";

const setContent = (process, Component, newItemLoading) => {
  switch (process) {
    case "loading":
      return newItemLoading ? <Component /> : <Spinner />;

    case "waiting":
      return <Spinner />;

    case "confirmed":
      return <Component />;

    case "error":
      return <ErrorMessage />;

    default:
      throw new Error("Process not found");
  }
};

const ComicsList = () => {
  const [comics, setComics] = useState([]);
  const [offset, setOffset] = useState(100);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [comicsEnded, setComicsEnded] = useState(false);

  const { loading, error, getAllComics, process, setProcess } =
    useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onComicsLoaded = (newComics) => {
    let ended = false;
    if (newComics.length < 8) {
      ended = true;
    }
    setComics((comics) => [...comics, ...newComics]);
    setNewItemLoading((newItemLoading) => false);
    setOffset((offset) => offset + 8);
    setComicsEnded((comicsEnded) => ended);
  };

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);

    getAllComics(offset)
      .then(onComicsLoaded)
      .then(() => setProcess("confirmed"));
  };

  function renderItems(arr) {
    const comicsList = arr.map((comic, i) => {
      return (
        <CSSTransition key={i} timeout={500} classNames="comics__item">
          <li className="comics__item">
            <Link to={`/comics/${comic.id}`}>
              <img
                src={comic.thumbnail}
                alt={comic.title}
                className="comics__item-img"
              />
              <div className="comics__item-name">{comic.title}</div>
              <div className="comics__item-price">{comic.price}$</div>
            </Link>
          </li>
        </CSSTransition>
      );
    });
    return (
      <ul className="comics__grid">
        <TransitionGroup component={null}>{comicsList}</TransitionGroup>
      </ul>
    );
  }

  return (
    <div className="comics__list">
      {setContent(process, () => renderItems(comics), newItemLoading)}
      <button
        style={{ display: comicsEnded ? "none" : "block" }}
        disabled={newItemLoading}
        onClick={() => onRequest(offset)}
        className="button button__main button__long"
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default ComicsList;
