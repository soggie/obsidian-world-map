// Database of locations
const cities = [
  {
    name: 'Morhas',
    desc: 'A gargantuan spire built atop a massive caldera of bubbling magma. Famed for the purity of their obsidian, their dour demeanour, and their fanatical adherence to tradition and order.',
    coord: L.latLng(-103.625, 172.625)
  },

  {
    name: 'Crasoa',
    desc: 'A city built around the ruins of an ancient colosseum. Ruled by warrior poets. Prideful of their martial past, but ignorant of how their warmongering destroyed the waystone network.',
    coord: L.latLng(-82.875, 71.25)
  },

  {
    name: 'Gausk',
    desc: 'A city of flags, portals, and crossroads. Once a prosperous trading hub, now an isolated, rotting den of thieves after the destruction of the waystone network in the war.',
    coord: L.latLng(-122.3125, 94.8125)
  },

  {
    name: 'Somar',
    desc: 'Haven for sorcerers and those who dabble in eldritch arts. A city that spans three realms at once: the real world, the realm of nightmares, and the realm of spirits.',
    coord: L.latLng(-142.125, 51.75)
  },

  {
    name: 'Nekris',
    desc: 'A necropolis where death is only the beginning of eternal servitude. Treats necromancy as more of a science than sorcery. Extremely obsessed with personal legacy and family lineages.',
    coord: L.latLng(-127.8125, 169.8125)
  },

  {
    name: 'Telerim',
    desc: 'A wonderous underwater city along the frozen coast. Pioneered a method to attain lichdom by replacing body parts with magic-infused mechanical equivalents. Insular and distrustful of outsiders.',
    coord: L.latLng(-83.125, 191.375)
  },

  {
    name: 'Raak',
    desc: 'Thousands of vertical farms form the foundations of the city of stilts. Produces a massive surplus of food due to a fertility ritual gone wrong. Ruled by a coven of shapeshifting druids.',
    coord: L.latLng(-159.25, 185.875)
  },
]

const ruins = [
  {
    name: 'Temple of the Dawn',
    desc: 'A massive ziggurat said to contain relics from the forgotten empire in almost pristine conditions. Zealously guarded by a powerful society of remembrancers called the Awakened Order.',
    coord: L.latLng(-113.25, 153.6875)
  },

  {
    name: 'Ashenfel',
    desc: 'Believed to be the capital of the forgotten empire, now a scorched ruins spawning an endless tide of horrors from beyond the Breach, held at bay by a tireless stream of warriors from Nekris',
    coord: L.latLng(-125.6875, 162)
  },

  {
    name: 'Sinthar',
    desc: 'Legendary stronghold of the Sintharii Circle who holds a monopoly on inter-city travel after the destruction of the waystone network. No outsider has succeeded in finding a way in yet.',
    coord: L.latLng(-121.0625, 181.25)
  },

  {
    name: 'Xisa',
    desc: 'The petrified remains of the god of hunt and forage. A faint purple light pulses from within the cracks. No person have ever managed to get close enough to study it without going mad.',
    coord: L.latLng(-110.375, 29.9375)
  },

  {
    name: 'Maska',
    desc: 'A massive pit lined with unknown organic matter, slime, blood and feces. In the middle of the pit is a massive hand clutching a spectacularly crafted ornate glaive in pristine condition.',
    coord: L.latLng(-137.71875, 82.625)
  },

  {
    name: 'Tower of Nadak',
    desc: 'An ornate and ancient tower with thousands of cacophonous chattering skulls lining its walls. A faint pulsing green glow emanates from the ornate windows in the tower\'s upper floors.',
    coord: L.latLng(-114, 127.6875)
  },

  {
    name: 'Blightharrow',
    desc: 'Fortress of a secret society called the Viceron Company. Overlooks the Breach. First line of defense against any eldritch horrors that crosses over to Itheas through the Breach.',
    coord: L.latLng(-118.3125, 136.0625)
  },

  {
    name: 'Wurmfall Pass',
    desc: 'A valley flanked by massive jagged pillars of rune-etched stones resembling a rib cage of a gargantuan serpent-like beast. The only (relatively) safe passage through the Balefire Range.',
    coord: L.latLng(-116.5625, 105.5625)
  }
]

// Create the custom icons
const cityIcon = L.icon({
  iconUrl: 'assets/marker.svg',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
})

const ruinsIcon = L.icon({
  iconUrl: 'assets/ruin.svg',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
})

const Map = function ({ 
  elementId = 'map-container', 
  tileUrl = 'tilelib/{z}-{x}-{y}.webp' 
}) {
  const SIZE = 8192
  const MAX_ZOOM = 5
  const map = L.map(elementId, {
    maxZoom: MAX_ZOOM,
    maxBoundsViscosity: 1.0, // prevent over-panning at the edges
    crs: L.CRS.Simple,
    doubleClickZoom: false // disable this because double click opens the menu
  })

  const sw = map.unproject([0, SIZE], MAX_ZOOM)
  const ne = map.unproject([SIZE, 0], MAX_ZOOM)
  const bounds = new L.LatLngBounds(sw, ne)
  map.setMaxBounds(bounds)

  L.tileLayer(
    tileUrl,
    {
      minZoom: 2,
      maxZoom: 5,
      center: bounds.getCenter(),
      noWrap: true,
      bounds: bounds
    }
  ).addTo(map)

  // Try to load the map's state from local storage
  const lat = window.localStorage.getItem('itheas-lat') || bounds.getCenter().lat
  const lng = window.localStorage.getItem('itheas-lng') || bounds.getCenter().lng
  const zoom = window.localStorage.getItem('itheas-zoom') || 2
  map.setView(new L.LatLng(lat, lng), zoom)

  // Load and place markers for cities
  const updateText = poi => {
    const original = 'Click on a Marker'
    document.getElementById('marker-title').innerHTML = poi.name
    document.getElementById('marker-description').innerHTML = poi.desc
    document.getElementById('marker-class').innerHTML = poi.type
  }

  for (const poi of cities) {
    // const marker = L.circleMarker(poi.coord, {
    //   radius: 10,
    //   color: '#732007',
    //   stroke: true,
    //   weight: 2,
    //   fill: true,
    //   fillColor: '#ed9479',
    //   fillOpacity: 0.8
    // })
    const marker = L.marker(poi.coord, { icon: cityIcon }).bindPopup(poi.name)
    marker.addTo(map)
    poi.type = 'city'
    marker.on('click', e => updateText(poi))
  }

  // Load and place markers for ruins
  for (const poi of ruins) {
    // const marker = L.circleMarker(poi.coord, {
    //   radius: 10,
    //   color: '#888888',
    //   stroke: true,
    //   weight: 2,
    //   fill: true,
    //   fillColor: '#cccccc',
    //   fillOpacity: 0.8
    // })
    const marker = L.marker(poi.coord, { icon: ruinsIcon }).bindPopup(poi.name)
    marker.addTo(map)
    poi.type = 'ruins'
    marker.on('click', e => updateText(poi))
  }

  return map
}

const itheas = Map({})

// Tie into onclick event

itheas.on('dblclick', function (e) {
  const coord = e.latlng

  // Get the current mouse location
  const origin = itheas.getPixelOrigin()
  const offset = itheas.latLngToLayerPoint(coord)

  const mousex = origin.x + offset.x
  const mousey = origin.y + offset.y

  // Add an icon to the map
  // L.marker(coord, { icon: cityIcon }).addTo(itheas)
  // L.circleMarker(coord, {
  //   radius: 10,
  //   color: '#732007',
  //   stroke: true,
  //   weight: 1,
  //   fill: true,
  //   fillColor: '#ed9479',
  //   fillOpacity: 0.8
  // }).addTo(itheas)

  console.log(coord.lat, coord.lng)

  // Show the tools container
  // const container = document.getElementById('tools-container')
  // container.classList.toggle('show')  
})

itheas.on('moveend', function (e) {
  const center = itheas.getCenter()
  const zoom = itheas.getZoom()

  // Save the center and zoom into local storage
  window.localStorage.setItem('itheas-lat', center.lat)
  window.localStorage.setItem('itheas-lng', center.lng)
  window.localStorage.setItem('itheas-zoom', zoom)
})