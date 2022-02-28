export default class MovieDBService {
  _apiBase = 'https://api.themoviedb.org/3';
  _apiKey = 'c192a079094160716b3290cca2487a86';

  async getResource(url) {
    const res = await fetch(`${this._apiBase}${url}`);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }

    return await res.json();
  }

  async getGuestSession() {
    const res = await this.getResource(`/authentication/guest_session/new?api_key=${this._apiKey}`);

    if (!res.success) {
      throw new Error('Could not authentication');
    }

    return res;
  }

  async getGenres() {
    const res = await this.getResource(`/genre/movie/list?api_key=${this._apiKey}`);
    return res.genres;
  }

  async getMovies(textRequest, page = 1) {
    return await this.getResource(`/search/movie?api_key=${this._apiKey}&query=${textRequest}&page=${page}`);
  }

  async getRatedMovies(guestSessionId, page = 1) {
    return await this.getResource(`/guest_session/${guestSessionId}/rated/movies?api_key=${this._apiKey}&page=${page}`);
  }

  async rateMovie(movieId, rating, guestSessionId) {
    let body = {
      value: rating,
    };

    const res = await fetch(
      `${this._apiBase}/movie/${movieId}/rating?api_key=${this._apiKey}&guest_session_id=${guestSessionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      throw new Error('Could not rate movie');
    }
  }
}
