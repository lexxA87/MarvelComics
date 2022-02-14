import { useState, useEffect } from "react";
import useMarvelService from "../../services/MarvelService";
import PropTypes from "prop-types";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import "./comicsList.scss";

const ComicsList = (props) => {
  const [comics, setComics] = useState([]);
  const [offset, setOffset] = useState(100);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [comicsEnded, setComicsEnded] = useState(false);

  const { loading, error, getAllComics } = useMarvelService();

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

    getAllComics(offset).then(onComicsLoaded);
  };

  function renderItems(arr) {
    const comicsList = arr.map((comic, i) => {
      return (
        <li
          key={i}
          className="comics__item"
          onClick={() => props.onSelectedComic(comic.id)}
        >
          <a href="#">
            <img
              src={comic.thumbnail}
              alt={comic.title}
              className="comics__item-img"
            />
            <div className="comics__item-name">{comic.title}</div>
            <div className="comics__item-price">{comic.price}$</div>
          </a>
        </li>
      );
    });
    return <ul className="comics__grid">{comicsList}</ul>;
  }

  const items = renderItems(comics);
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading && !newItemLoading ? <Spinner /> : null;

  return (
    <div className="comics__list">
      {errorMessage}
      {spinner}
      {items}
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

ComicsList.propTypes = {
  onSelectedComic: PropTypes.func.isRequired,
};

export default ComicsList;
