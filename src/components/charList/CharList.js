import { useState, useEffect, useRef } from "react";

import PropTypes from "prop-types";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import MarvelService from "../../services/MarvelService";
import "./charList.scss";

const CharList = (props) => {
  const [chars, setChars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [offset, setOffset] = useState(210);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [charsEnded, setCharsEnded] = useState(false);

  useEffect(() => {
    onRequest();
  }, []);

  const marvelService = new MarvelService();

  const onCharsLoading = () => {
    setNewItemLoading(true);
  };

  const onCharsLoaded = (newChars) => {
    let ended = false;
    if (newChars.length < 9) {
      ended = true;
    }
    setChars((chars) => [...chars, ...newChars]);
    setLoading((loading) => false);
    setNewItemLoading((newItemLoading) => false);
    setOffset((offset) => offset + 9);
    setCharsEnded((charsEnded) => ended);
  };

  const onError = () => {
    setLoading(false);
    setError(true);
  };

  const onRequest = (offset) => {
    onCharsLoading();
    marvelService.getAllCharacters(offset).then(onCharsLoaded).catch(onError);
  };

  const itemRefs = useRef([]);

  const focusOnItem = (id) => {
    itemRefs.current.forEach((item) =>
      item.classList.remove("char__item_selected")
    );
    itemRefs.current[id].classList.add("char__item_selected");
    itemRefs.current[id].focus();
  };

  function renderItems(arr) {
    const charsList = arr.map((char, i) => {
      let imageObjectFit = {};
      if (
        char.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      ) {
        imageObjectFit = { objectFit: "contain" };
      } else {
        imageObjectFit = { objectFit: "cover" };
      }
      return (
        <li
          key={char.id}
          tabIndex={0}
          ref={(el) => (itemRefs.current[i] = el)}
          onClick={() => {
            props.onSelectedChar(char.id);
            focusOnItem(i);
          }}
          onKeyPress={(e) => {
            if (e.key === " " || e.key === "Enter") {
              props.onSelectedChar(char.id);
              focusOnItem(i);
            }
          }}
          className="char__item"
        >
          <img
            src={char.thumbnail}
            alt={char.thumbnail}
            style={imageObjectFit}
          />
          <div className="char__name">{char.name}</div>
        </li>
      );
    });
    return <ul className="char__grid">{charsList}</ul>;
  }

  const items = renderItems(chars);
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(error || loading) ? items : null;

  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
      {content}

      <button
        style={{ display: charsEnded ? "none" : "block" }}
        disabled={newItemLoading}
        onClick={() => onRequest(offset)}
        className="button button__main button__long"
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

CharList.propTypes = {
  onSelectedChar: PropTypes.func.isRequired,
};

export default CharList;
