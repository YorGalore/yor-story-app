import * as L from 'leaflet';
import { addNewStory } from '../api.js';

export default class AddStoryPage {
  #selectedLat = null;
  #selectedLon = null;
  #mapMarker = null;

  async render() {
    return `
      <section class="container">
        <h1>Tambah Cerita Baru</h1>
        <form id="add-story-form">
          <div>
            <label for="photo">Upload Foto (Max 1MB):</label>
            <input type="file" id="photo" name="photo" accept="image/*" required>
          </div>
          <div>
            <label for="description">Deskripsi:</label>
            <textarea id="description" name="description" rows="4" required></textarea>
          </div>
          
          <div>
            <label>Pilih Lokasi di Peta:</label>
            <div id="map-picker" style="height: 300px; width: 100%;"></div>
          </div>
          
          <button type="submit">Upload Cerita</button>
        </form>
        <p id="error-message" style="color: red;"></p>
      </section>
    `;
  }

  async afterRender() {
    const map = L.map('map-picker').setView([-2.5489, 118.0149], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    map.on('click', (e) => {
      this.#selectedLat = e.latlng.lat;
      this.#selectedLon = e.latlng.lng;

      if (this.#mapMarker) {
        map.removeLayer(this.#mapMarker);
      }
      this.#mapMarker = L.marker([this.#selectedLat, this.#selectedLon]).addTo(map);
      
      alert(`Lokasi dipilih: ${this.#selectedLat}, ${this.#selectedLon}`);
    });

    const addStoryForm = document.querySelector('#add-story-form');
    const errorMessage = document.querySelector('#error-message');

    addStoryForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      errorMessage.textContent = '';

      if (!this.#selectedLat || !this.#selectedLon) {
        errorMessage.textContent = 'Silakan pilih lokasi di peta terlebih dahulu.';
        return;
      }

      const photo = event.target.photo.files[0];
      const description = event.target.description.value;

      if (!photo || !description) {
         errorMessage.textContent = 'Foto dan deskripsi tidak boleh kosong.';
        return;
      }

      const formData = new FormData();
      formData.append('photo', photo);
      formData.append('description', description);
      formData.append('lat', this.#selectedLat);
      formData.append('lon', this.#selectedLon);

      try {
        const result = await addNewStory(formData);
        if (result.error) {
          throw new Error(result.message);
        }

        alert('Cerita berhasil ditambahkan!');
        window.location.hash = '#/'; 

      } catch (error) {
        errorMessage.textContent = `Gagal menambah cerita: ${error.message}`;
      }
    });
  }
}