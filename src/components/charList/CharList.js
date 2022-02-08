import { Component } from "react";

import MarvelService from "../../services/MarvelService";
import "./charList.scss";

class CharList extends Component {
  state = {
    chars: [],
  };

  componentDidMount() {
    this.updateChars();
  }

  marvelService = new MarvelService();

  onCharsLoaded = (chars) => {
    this.setState({ chars });
  };

  updateChars = () => {
    this.marvelService.getAllCharacters().then(this.onCharsLoaded);
  };

  render() {
    const { chars } = this.state;
    const charsList = chars.map((char) => {
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
    return (
      <div className="char__list">
        <ul className="char__grid">
          {charsList}
          {/* <li className="char__item">
            <img src={abyss} alt="abyss" />
            <div className="char__name">Abyss</div>
          </li>
          <li className="char__item char__item_selected">
            <img src={abyss} alt="abyss" />
            <div className="char__name">Abyss</div>
          </li>
          <li className="char__item">
            <img src={abyss} alt="abyss" />
            <div className="char__name">Abyss</div>
          </li>
          <li className="char__item">
            <img src={abyss} alt="abyss" />
            <div className="char__name">Abyss</div>
          </li>
          <li className="char__item">
            <img src={abyss} alt="abyss" />
            <div className="char__name">Abyss</div>
          </li>
          <li className="char__item">
            <img src={abyss} alt="abyss" />
            <div className="char__name">Abyss</div>
          </li>
          <li className="char__item">
            <img src={abyss} alt="abyss" />
            <div className="char__name">Abyss</div>
          </li>
          <li className="char__item">
            <img src={abyss} alt="abyss" />
            <div className="char__name">Abyss</div>
          </li>
          <li className="char__item">
            <img src={abyss} alt="abyss" />
            <div className="char__name">Abyss</div>
          </li> */}
        </ul>
        <button className="button button__main button__long">
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;
