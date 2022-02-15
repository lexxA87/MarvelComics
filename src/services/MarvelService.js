import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
  const { loading, error, request, clearError } = useHttp();

  const _apiBase = "https://gateway.marvel.com:443/v1/public/";
  const _apiKey = "apikey=f5a3f0d4c755663ea34658c9e04c739d";
  const _baseOffset = 210;

  // const getResource = async (url) => {
  //   let res = await fetch(url);

  //   if (!res.ok) {
  //     throw new Error(`Could not fetch ${url}, status: ${res.status}`);
  //   }

  //   return await res.json();
  // };

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(
      `${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`
    );
    return res.data.results.map(_transformCharacter);
  };

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
    return _transformCharacter(res.data.results[0]);
  };

  const getAllComics = async (offset = _baseOffset) => {
    const res = await request(
      `${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`
    );
    return res.data.results.map(_transformComic);
  };

  const getComic = async (id) => {
    const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
    return _transformComic(res.data.results[0]);
  };

  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description
        ? `${char.description.slice(0, 210)}...`
        : "Sorry, description is not found...",
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  };

  const _transformComic = (comic) => {
    return {
      id: comic.id,
      title: comic.title,
      pageCount: comic.pageCount
        ? `${comic.pageCount} pages`
        : "No info about the number of pages...",
      description: comic.description || "Sorry, description is not found...",
      thumbnail: comic.thumbnail.path + "." + comic.thumbnail.extension,
      language: comic.textObjects.language || "en-us",
      homepage: comic.urls[0].url,
      price: comic.prices[0].price
        ? `${comic.prices[0].price}$`
        : "Not available",
    };
  };

  return {
    loading,
    error,
    clearError,
    getAllCharacters,
    getCharacter,
    getAllComics,
    getComic,
  };
};

export default useMarvelService;
