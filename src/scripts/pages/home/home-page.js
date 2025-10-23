import * as L from 'leaflet';
import { getAllStories } from '../../api.js';
import { showFormattedDate } from '../../utils.js'; 

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default class HomePage {
  async render() {
    return `
      <section class="container">
        <h1>Peta Cerita</h1>
        <div id="map" style="height: 450px; width: 100%; margin-bottom: 20px;"></div>
        <h2>Daftar Cerita</h2>
        <div id="story-list" class="story-list"></div>
      </section>
    `;
  }

  async afterRender() {
    // 1. Ambil data stories
    const storiesResponse = await getAllStories();
    if (storiesResponse.error) {
      if (storiesResponse.message === 'Missing token') {
        alert('Anda harus login terlebih dahulu.');
      }
      return; 
    }

    const stories = storiesResponse.listStory;
    const map = L.map('map').setView([-2.5489, 118.0149], 5); // Center Indonesia

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const storyListContainer = document.querySelector('#story-list');
    storyListContainer.innerHTML = '';

    stories.forEach(story => {
      const storyElement = document.createElement('article');
      storyElement.classList.add('story-item');
      storyElement.innerHTML = `
        <img src="${story.photoUrl}" alt="Cerita oleh ${story.name}">
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <small>${showFormattedDate(story.createdAt)}</small>
      `;
      storyListContainer.appendChild(storyElement);

      if (story.lat && story.lon) {
        L.marker([story.lat, story.lon])
          .addTo(map)
          .bindPopup(`
            <img src="${story.photoUrl}" alt="Cerita oleh ${story.name}" style="width:100%">
            <b>${story.name}</b><br>
            ${story.description.substring(0, 50)}...
          `);
      }
    });
  }
}