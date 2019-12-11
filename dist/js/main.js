"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function () {
  var SearchSection =
  /*#__PURE__*/
  function () {
    function SearchSection(el) {
      var _this = this;

      _classCallCheck(this, SearchSection);

      // set properties
      this.search = {
        query: el.querySelector('form input[type=text]'),
        button: el.querySelector('form input[type=submit]')
      };
      this.resultsSection = el.querySelector('section.search-results');
      this.cardsHolder = document.createElement('div'); // bind events

      this.search.button.addEventListener('click', function (e) {
        e.preventDefault();

        _this.fireSearch();
      });
    }

    _createClass(SearchSection, [{
      key: "getHints",
      value: function getHints() {
        console.log('geting hints');
      }
    }, {
      key: "fireSearch",
      value: function fireSearch() {
        var _this2 = this;

        var oReq = new XMLHttpRequest();
        var url = "http://www.omdbapi.com/";
        var search = "s=".concat(this.search.query.value);
        var key = "apikey=31edb057";
        var response = "r=json";
        var page = "page=1";
        oReq.addEventListener("load", function (e) {
          var results = e.currentTarget.response;

          var cards = _this2.handleResults(results);

          var cardsHolder = document.createElement('div');
          cardsHolder.className = 'cards-holder';
          _this2.resultsSection.innerHTML = '';

          if (!!cards.length) {
            cards.forEach(function (card) {
              var cardCol = document.createElement('span');
              cardCol.className = 'col-4';
              cardCol.appendChild(card);
              cardsHolder.appendChild(cardCol);

              _this2.resultsSection.appendChild(cardsHolder);
            });
          } else {
            _this2.resultsSection.innerHTML = "<h2>Oops, an error occurred!</h2><p>".concat(cards.error, "</p><h2>Please try again!</h2>");
          }
        });
        var loader = document.createElement('img');
        loader.src = './dist/imgs/91.gif';
        this.resultsSection.appendChild(loader);
        oReq.open("GET", "".concat(url, "?").concat(search, "&").concat(key, "&").concat(response, "&").concat(page));
        oReq.send();
      }
    }, {
      key: "handleResults",
      value: function handleResults(results) {
        var apiResp = JSON.parse(results);
        var arrCards = [];

        if (apiResp.Response == 'True' && !apiResp.Error) {
          apiResp.Search.forEach(function (data) {
            var card = new Card(data);
            arrCards.push(card.render());
          });
          return arrCards;
        } else {
          return {
            error: apiResp.Error
          };
        }
      }
    }]);

    return SearchSection;
  }();

  var Card =
  /*#__PURE__*/
  function () {
    function Card(props) {
      _classCallCheck(this, Card);

      this.id = props.imdbID;
      this.title = props.Title;
      this.year = props.Year;
      this.type = props.Type;
      this.poster = props.Poster != "N/A" && props.Poster || './dist/imgs/placeholder-movieimage.png';
      this.elements = this.createElements();
    }

    _createClass(Card, [{
      key: "createElements",
      value: function createElements() {
        var _this3 = this;

        var card = document.createElement('div');
        var imgHolder = document.createElement('div');
        var img = document.createElement('img');
        var cardBody = document.createElement('div');
        var cardFooter = document.createElement('div');
        var heading = document.createElement('h3');
        var type = document.createElement('p');
        var btn = document.createElement('a');
        card.className = "card";
        imgHolder.className = "card-image bg-cover";
        cardBody.className = "card-descriptions";
        cardFooter.className = "card-footer";
        imgHolder.style.backgroundImage = "url(".concat(this.poster, ")");
        img.src = this.poster;
        img.alt = "".concat(this.title, " Movie Poster");
        imgHolder.appendChild(img);
        heading.innerText = "".concat(this.title);
        type.innerHTML = "\n        <b>Year:</b> ".concat(this.year, " <br/>\n        <b>Type:</b> ").concat(this.type, "\n      ");
        cardBody.appendChild(heading);
        cardBody.appendChild(type);
        btn.innerText = 'See Details';
        btn.href = '#';
        btn.dataset.imdbid = this.id;
        btn.className = 'btn btn-red btn-details';
        btn.addEventListener('click', function (e) {
          e.preventDefault();

          _this3.goToDetails();
        });
        cardFooter.appendChild(btn);
        card.appendChild(imgHolder);
        card.appendChild(cardBody);
        card.appendChild(cardFooter);
        return card;
      }
    }, {
      key: "goToDetails",
      value: function goToDetails() {
        var oReq = new XMLHttpRequest();
        var url = "http://www.omdbapi.com/";
        var search = "i=".concat(this.id);
        var key = "apikey=31edb057";
        var plot = "plot=full";
        var response = 'r=json';
        oReq.addEventListener("load", function (e) {
          var result = e.currentTarget.response;
          var movieDetails = new MovieDetails(JSON.parse(result));
          var searchResults = document.querySelector('section.search-results');
          searchResults.innerHTML = movieDetails.buildDetailsView().outerHTML;
        });
        oReq.open("GET", "".concat(url, "?").concat(search, "&").concat(key, "&").concat(plot, "&").concat(response));
        oReq.send();
      }
    }, {
      key: "render",
      value: function render() {
        return this.elements;
      }
    }]);

    return Card;
  }();

  var MovieDetails =
  /*#__PURE__*/
  function () {
    function MovieDetails(props) {
      _classCallCheck(this, MovieDetails);

      this.details = props;
    }

    _createClass(MovieDetails, [{
      key: "buildDetailsView",
      value: function buildDetailsView() {
        // Master parent holder
        var detailsLayout = document.createElement('div');
        detailsLayout.className = 'details'; // Top section for poster and small descriptions

        var firstSection = document.createElement('section');
        var posterHolder = document.createElement('div');
        var posterImg = document.createElement('img');
        var smDescript = document.createElement('div');
        var heading = document.createElement('h2');
        var smDetailsList = document.createElement('ul');
        var director = document.createElement('li');
        var actors = document.createElement('li');
        var production = document.createElement('li');
        var boxOfice = document.createElement('li');
        var released = document.createElement('li');
        var votes = document.createElement('li');
        var posterURL = this.details.Poster != "N/A" && this.details.Poster || './dist/imgs/placeholder-movieimage.png';
        firstSection.className = 'details-firstSection';
        posterHolder.classList = 'bg-cover details-poster';
        smDescript.classList = 'details-smDescription';
        posterHolder.style.backgroundImage = "url(".concat(posterURL, ")");
        posterImg.src = posterURL;
        posterImg.alt = "".concat(this.details.Title, " Movie Poster");
        heading.innerText = "".concat(this.details.Title, " (").concat(this.details.Year, ")");
        director.innerHTML = "<span class='list-label'>Director:</span> ".concat(this.details.Director);
        actors.innerHTML = "<span class='list-label'>Actors:</span> ".concat(this.details.Actors);
        production.innerHTML = "<span class='list-label'>Production:</span> ".concat(this.details.Production);
        boxOfice.innerHTML = "<span class='list-label'>Box Office:</span> ".concat(this.details.BoxOffice);
        released.innerHTML = "<span class='list-label'>Released:</span> ".concat(this.details.Released);
        votes.innerHTML = "<span class='list-label'>IMDb Votes:</span> ".concat(this.details.imdbVotes);
        posterHolder.appendChild(posterImg);
        smDetailsList.appendChild(director);
        smDetailsList.appendChild(actors);
        smDetailsList.appendChild(production);
        smDetailsList.appendChild(boxOfice);
        smDetailsList.appendChild(released);
        smDetailsList.appendChild(votes);
        smDescript.appendChild(heading);
        smDescript.appendChild(smDetailsList);
        firstSection.appendChild(posterHolder);
        firstSection.appendChild(smDescript); // Second section, more details and plot

        var seccondSection = document.createElement('section');
        var plot = document.createElement('div');
        plot.innerHTML = "<h3>Plot: </h3><p>".concat(this.details.Plot, "</p>");
        seccondSection.className = 'details-seccondSection';
        seccondSection.appendChild(plot); // Second section, more details and plot

        var thirdSection = document.createElement('section');
        thirdSection.innerHTML = "<h3>Ratings: </h3";
        thirdSection.className = 'details-thirdSection';
        var ratings = [];
        this.details.Ratings.forEach(function (el) {
          var div = document.createElement('div');
          var img = document.createElement('img');
          var source = document.createElement('h4');
          var rate = document.createElement('p');
          div.className = 'rating-card col-3';
          source.innerText = el.Source;
          rate.innerHTML = el.Value;
          img.src = el.Source == 'Internet Movie Database' && 'dist/imgs/imdb.png' || el.Source == 'Rotten Tomatoes' && 'dist/imgs/rotten-tomatoes.png' || el.Source == 'Metacritic' && 'dist/imgs/metacritic.png';
          img.alt = "".concat(el.Source, " ilustrative png image");
          div.appendChild(img);
          div.appendChild(source);
          div.appendChild(rate);
          thirdSection.appendChild(div);
        });
        detailsLayout.appendChild(firstSection);
        detailsLayout.appendChild(seccondSection);
        detailsLayout.appendChild(thirdSection);
        return detailsLayout;
      }
    }]);

    return MovieDetails;
  }();

  var arrSearchSections = document.querySelectorAll('section.search');
  arrSearchSections.forEach(function (el) {
    var searchSection = new SearchSection(el);
    searchSection.search.query.value = "batman";
    searchSection.fireSearch();
  });
})();
//# sourceMappingURL=maps/main.js.map
