function createMap() {
mapboxgl.accessToken = 'pk.eyJ1IjoicmFtYm8tcmVhY3QiLCJhIjoiY2t2ZzljNnFqN3FlbDJuczdkOHd5cjF3OSJ9.yaBqKRzHJW1-YQBUEjC7JQ';
let map = new mapboxgl.Map({
    container: 'map',
    center: [2.3364, 48.86091],
    style: 'mapbox://styles/mapbox/light-v10',
    zoom: 16
});
// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

const marker1 = new mapboxgl.Marker({ color: 'black' })
    .setLngLat([2.3364, 48.86091])
    .addTo(map);

const marker2 = new mapboxgl.Marker({ color: 'gray' })
    .setLngLat([2.3333, 48.8602])
    .addTo(map);

const marker3 = new mapboxgl.Marker({ color: 'gray' })
    .setLngLat([2.3397, 48.8607])
    .addTo(map);

const marker4 = new mapboxgl.Marker({ color: 'gray' })
    .setLngLat([2.3330, 48.8619])
    .addTo(map);

const marker5 = new mapboxgl.Marker({ color: 'gray' })
    .setLngLat([2.3365, 48.8625])
    .addTo(map);   
}

export default createMap;
