import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

const simpleLightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let page = 1;

btnLoadMore.style.display = 'none';
form.addEventListener('submit', forSearch);
btnLoadMore.addEventListener('click', forBtnLoadMore);

function forSearch(evt) {
  evt.preventDefault();
  page = 1;
  gallery.innerHTML = '';
  const name = input.value.trim();
  if (name !== '') {
    pixabay(name);
  } else {
    btnLoadMore.style.display = 'none';
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function forBtnLoadMore() {
  const name = input.value.trim();
  page += 1;
  pixabay(name, page);
}

async function pixabay(name, page) {
  const api_Url = 'https://pixabay.com/api/';
  const options = {
    params: {
      key: '34713659-8512d0423b25e13e6eda39bc1',
      q: name,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: page,
      per_page: 40,
    },
  };
  try {
    const response = await axios.get(api_Url, options);
    notification(response.data.hits.length, response.data.total);
    insertMarkup(response.data.hits);
  } catch (error) {
    console.log(error);
  }
}

function insertMarkup(objectsArray) {
  const markup = objectsArray
    .map(
      photoObject =>
        `<a href="${photoObject.largeImageURL}">
            <div class="photo-card">
            <div class="photo">
            <img src="${photoObject.webformatURL}" alt="${photoObject.tags}" loading="lazy"/>
            </div>
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b>
                            ${photoObject.likes}
                        </p>
                        <p class="info-item">
                            <b>Views</b>
                            ${photoObject.views}
                        </p>
                        <p class="info-item">
                            <b>Comments</b>
                            ${photoObject.comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads</b>
                            ${photoObject.downloads}
                        </p>
                    </div>
            </div>
        </a>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  simpleLightBox.refresh();
}

function notification(length, totalHits) {
  if (length === 0) {
    btnLoadMore.style.display = 'none';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  if (page === 1) {
    btnLoadMore.style.display = 'flex';
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }
  if (length < 40) {
    btnLoadMore.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
