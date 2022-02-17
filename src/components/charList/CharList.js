import { useState, useEffect, useRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import PropTypes from "prop-types";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import useMarvelService from "../../services/MarvelService";
import "./charList.scss";

const CharList = (props) => {
  const [chars, setChars] = useState([]);
  const [offset, setOffset] = useState(210);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [charsEnded, setCharsEnded] = useState(false);

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const { loading, error, getAllCharacters } = useMarvelService();

  const onCharsLoaded = (newChars) => {
    let ended = false;
    if (newChars.length < 9) {
      ended = true;
    }
    setChars((chars) => [...chars, ...newChars]);
    setNewItemLoading((newItemLoading) => false);
    setOffset((offset) => offset + 9);
    setCharsEnded((charsEnded) => ended);
  };

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);

    getAllCharacters(offset).then(onCharsLoaded);
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
        <CSSTransition key={char.id} timeout={500} classNames="char__item">
          <li
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
        </CSSTransition>
      );
    });
    return (
      <ul className="char__grid">
        <TransitionGroup component={null}>{charsList}</TransitionGroup>
      </ul>
    );
  }

  const items = renderItems(chars);
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading && !newItemLoading ? <Spinner /> : null;

  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
      {items}

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
