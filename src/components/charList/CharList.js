import { Component } from "react";

import PropTypes from "prop-types";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import MarvelService from "../../services/MarvelService";
import "./charList.scss";

class CharList extends Component {
  state = {
    chars: [],
    loading: true,
    error: false,
    offset: 210,
    newItemLoading: false,
    charsEnded: false,
  };

  componentDidMount() {
    this.onRequest();
  }

  marvelService = new MarvelService();

  onCharsLoading = () => {
    this.setState({
      newItemLoading: true,
    });
  };

  onCharsLoaded = (newChars) => {
    let ended = false;
    if (newChars.length < 9) {
      ended = true;
    }

    this.setState(({ offset, chars }) => ({
      chars: [...chars, ...newChars],
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      charsEnded: ended,
    }));
  };

  onError = () => {
    this.setState({ loading: false, error: true });
  };

  onRequest = (offset) => {
    this.onCharsLoading();
    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharsLoaded)
      .catch(this.onError);
  };

  itemRefs = [];

  setRef = (ref) => {
    this.itemRefs.push(ref);
  };

  focusOnItem = (id) => {
    this.itemRefs.forEach((item) =>
      item.classList.remove("char__item_selected")
    );
    this.itemRefs[id].classList.add("char__item_selected");
    this.itemRefs[id].focus();
  };

  renderItems(arr) {
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
          ref={this.setRef}
          onClick={() => {
            this.props.onSelectedChar(char.id);
            this.focusOnItem(i);
          }}
          onKeyPress={(e) => {
            if (e.key === " " || e.key === "Enter") {
              this.props.onSelectedChar(char.id);
              this.focusOnItem(i);
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

  render() {
    const { chars, loading, error, newItemLoading, offset, charsEnded } =
      this.state;
    const items = this.renderItems(chars);
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
          onClick={() => this.onRequest(offset)}
          className="button button__main button__long"
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

CharList.propTypes = {
  onSelectedChar: PropTypes.func,
};

export default CharList;
