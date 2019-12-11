(() => {
  class SearchSection {
    constructor(el){
      // set properties
      this.search = {
        query: el.querySelector('form input[type=text]'),
        button: el.querySelector('form input[type=submit]')
      };
      this.resultsSection = el.querySelector('section.search-results');
      this.cardsHolder = document.createElement('div');

      // bind events
      this.search.button.addEventListener('click', e => {
        e.preventDefault();
        this.fireSearch();
      });
    }

    getHints() {
      console.log('geting hints');
    }

    fireSearch() {
      const oReq = new XMLHttpRequest;
      const url = "https://www.omdbapi.com/";
      const search = `s=${this.search.query.value}`;
      const key = `apikey=31edb057`;
      const response = `r=json`;
      const page = `page=1`;
      
      oReq.addEventListener("load", e => {
        const results = e.currentTarget.response;
        const cards = this.handleResults(results);
        const cardsHolder = document.createElement('div');
        cardsHolder.className = 'cards-holder';
        
        this.resultsSection.innerHTML = '';
        if(!!cards.length){
          cards.forEach(card => {
            const cardCol = document.createElement('span');
            
            cardCol.className = 'col-4';

            cardCol.appendChild(card);
            cardsHolder.appendChild(cardCol);
            this.resultsSection.appendChild(cardsHolder);
          });
        } else {
            this.resultsSection.innerHTML = `<h2>Oops, an error occurred!</h2><p>${cards.error}</p><h2>Please try again!</h2>`;
        }
      });
      const loader = document.createElement('img');
      loader.src = './dist/imgs/91.gif';
      this.resultsSection.appendChild(loader)
      oReq.open("GET", `${url}?${search}&${key}&${response}&${page}`);
      oReq.send();
    }

    handleResults(results) {
      const apiResp = JSON.parse(results);
      const arrCards = [];
      if(apiResp.Response == 'True' && !apiResp.Error){
        apiResp.Search.forEach( data => {
          const card = new Card(data);
          arrCards.push(card.render());
        });
        return arrCards;
      }
      else {
        return {error: apiResp.Error};
      }
    }


  }
  
  class Card {
    constructor(props){
      this.id = props.imdbID;
      this.title = props.Title;
      this.year = props.Year;
      this.type = props.Type;
      this.poster = (props.Poster != "N/A" && props.Poster) || './dist/imgs/placeholder-movieimage.png';
      this.elements = this.createElements();
    }

    createElements(){
      const card = document.createElement('div');
      const imgHolder = document.createElement('div');
      const img = document.createElement('img');
      const cardBody = document.createElement('div');
      const cardFooter = document.createElement('div');
      const heading = document.createElement('h3');
      const type = document.createElement('p');
      const btn = document.createElement('a');

      card.className = "card";
      imgHolder.className = "card-image bg-cover";
      cardBody.className = "card-descriptions";
      cardFooter.className = "card-footer";

      imgHolder.style.backgroundImage = `url(${this.poster})`;
      img.src = this.poster;
      img.alt = `${this.title} Movie Poster`;
      imgHolder.appendChild(img);
      heading.innerText = `${this.title}`;
      type.innerHTML = `
        <b>Year:</b> ${this.year} <br/>
        <b>Type:</b> ${this.type}
      `;
      cardBody.appendChild(heading);
      cardBody.appendChild(type);
      btn.innerText = 'See Details';
      btn.href = '#';
      btn.dataset.imdbid = this.id;
      btn.className = 'btn btn-red btn-details';
      btn.addEventListener('click', e => {
        e.preventDefault();
        this.goToDetails();
      });
      cardFooter.appendChild(btn);
      card.appendChild(imgHolder);
      card.appendChild(cardBody);
      card.appendChild(cardFooter);

      return card;
    }

    goToDetails(){
      const oReq = new XMLHttpRequest;
      const url = "https://www.omdbapi.com/";
      const search = `i=${this.id}`;
      const key = `apikey=31edb057`;
      const plot = `plot=full`;
      const response = 'r=json';
      
      oReq.addEventListener("load", e => {
        const result = e.currentTarget.response;
        const movieDetails = new MovieDetails(JSON.parse(result));
        const searchResults = document.querySelector('section.search-results');

        searchResults.innerHTML = movieDetails.buildDetailsView().outerHTML;
      });
      oReq.open("GET", `${url}?${search}&${key}&${plot}&${response}`);
      oReq.send();
    }

    render(){
      return this.elements;
    }
  }

  class MovieDetails {
    constructor(props) {
      this.details = props;
    }

    buildDetailsView() {
      // Master parent holder
      const detailsLayout = document.createElement('div');
      detailsLayout.className = 'details';

      // Top section for poster and small descriptions
      const firstSection = document.createElement('section');
      const posterHolder = document.createElement('div');
      const posterImg = document.createElement('img');
      const smDescript = document.createElement('div');
      const heading = document.createElement('h2');
      const smDetailsList = document.createElement('ul');
      const director = document.createElement('li');
      const actors = document.createElement('li');
      const production = document.createElement('li');
      const boxOfice = document.createElement('li');
      const released = document.createElement('li');
      const votes = document.createElement('li');
      const posterURL = (this.details.Poster != "N/A" && this.details.Poster) || './dist/imgs/placeholder-movieimage.png';

      firstSection.className = 'details-firstSection';
      posterHolder.classList = 'bg-cover details-poster';
      smDescript.classList = 'details-smDescription';

      posterHolder.style.backgroundImage = `url(${posterURL})`;
      posterImg.src = posterURL;
      posterImg.alt = `${this.details.Title} Movie Poster`;
      heading.innerText = `${this.details.Title} (${this.details.Year})`;
      director.innerHTML = `<span class='list-label'>Director:</span> ${this.details.Director}`;
      actors.innerHTML = `<span class='list-label'>Actors:</span> ${this.details.Actors}`;
      production.innerHTML = `<span class='list-label'>Production:</span> ${this.details.Production}`;
      boxOfice.innerHTML = `<span class='list-label'>Box Office:</span> ${this.details.BoxOffice}`;
      released.innerHTML = `<span class='list-label'>Released:</span> ${this.details.Released}`;
      votes.innerHTML = `<span class='list-label'>IMDb Votes:</span> ${this.details.imdbVotes}`;

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
      firstSection.appendChild(smDescript);     
      
      // Second section, more details and plot
      const seccondSection = document.createElement('section');
      const plot = document.createElement('div');

      plot.innerHTML = `<h3>Plot: </h3><p>${this.details.Plot}</p>`;

      seccondSection.className = 'details-seccondSection';

      seccondSection.appendChild(plot);

      // Second section, more details and plot
      const thirdSection = document.createElement('section');

      thirdSection.innerHTML = "<h3>Ratings: </h3";
      thirdSection.className = 'details-thirdSection';
      
      let ratings = [];
      this.details.Ratings.forEach( el => {
        const div = document.createElement('div');
        const img = document.createElement('img');
        const source = document.createElement('h4');
        const rate = document.createElement('p');

        div.className = 'rating-card col-3';
        source.innerText = el.Source;
        rate.innerHTML = el.Value;
        img.src = 
          el.Source == 'Internet Movie Database' && 'dist/imgs/imdb.png'
          || el.Source == 'Rotten Tomatoes' && 'dist/imgs/rotten-tomatoes.png'
          || el.Source == 'Metacritic' && 'dist/imgs/metacritic.png'
        ;
        img.alt = `${el.Source} ilustrative png image`;

        div.appendChild(img); 
        div.appendChild(source); 
        div.appendChild(rate); 

        thirdSection.appendChild(div);
      });


      detailsLayout.appendChild(firstSection)
      detailsLayout.appendChild(seccondSection);
      detailsLayout.appendChild(thirdSection);

      return detailsLayout;
    }
    
  }
  
  const arrSearchSections = document.querySelectorAll('section.search');
  arrSearchSections.forEach( el => {
    const searchSection = new SearchSection(el);
    searchSection.search.query.value = "batman";
    searchSection.fireSearch();
  });
})()
