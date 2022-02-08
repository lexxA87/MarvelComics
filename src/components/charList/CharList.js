import { Component } from "react";

import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import MarvelService from "../../services/MarvelService";
import "./charList.scss";

class CharList extends Component {
  state = {
    chars: [],
    loading: true,
    error: false,
  };

  componentDidMount() {
    this.updateChars();
  }

  marvelService = new MarvelService();

  onCharsLoaded = (chars) => {
    this.setState({ chars, loading: false });
  };

  onError = () => {
    this.setState({ loading: false, error: true });
  };

  updateChars = () => {
    this.marvelService
      .getAllCharacters()
      .then(this.onCharsLoaded)
      .catch(this.onError);
  };

  renderItems(arr) {
    const charsList = arr.map((char) => {
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
        <li key={char.id} className="char__item">
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
    const { chars, loading, error } = this.state;
    const items = this.renderItems(chars);
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(error || loading) ? items : null;

    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}

        <button className="button button__main button__long">
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;
