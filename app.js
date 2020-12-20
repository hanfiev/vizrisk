mapboxgl.accessToken =
  "pk.eyJ1IjoiY2l0eXBsYW4tbGFicyIsImEiOiJjajVvY29sczUzOGxpMzNtbm01czV5ejVpIn0.tM76BldWIAHyWdNPSPRGtg";
var map = new mapboxgl.Map({
  container: "map",
  zoom: 9,
  center: [115.132799, -8.358901],
  bearing: 27,
  pitch: 60,
  style: "mapbox://styles/cityplan-labs/cjy4buqii0f8p1cojsdq8x6eu",
});

let windowWidth = $(window).width();

function checkMedia() {
  if (windowWidth > 768) {
    map.easeTo({ padding: { right: 600 } });
  }
}

map.on("load", function () {
  map.rotateTo(-45, {
    duration: 10000,
  });

  map.addSource("iso", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  });

  map.addLayer({
    id: "isoLayer",
    type: "fill",
    // Use "iso" as the data source for this layer
    source: "iso",
    layout: {},
    paint: {
      // The fill color for the layer is set to a light purple
      "fill-color": "#00B200",
      "fill-opacity": 0.3,
    },
  });

  map.addSource("hazardSource", {
    type: "geojson",
    data: "data/hazardArea.geojson",
  });

  map.addLayer({
    id: "hazard",
    type: "fill",
    source: "hazardSource",
    layout: {
      visibility: "none",
    },
    paint: {
      "fill-color": [
        "match",
        ["get", "unsur"],
        "KRB I Gunungapi",
        "#ffff00",
        "KRB II Gunungapi",
        "#ffa500",
        "KRB III Gunungapi",
        "#ff0000",
        /* other */
        "#ccc",
      ],
      "fill-opacity": 0.5,
    },
  });

  map.addSource("TourismSource", {
    type: "geojson",
    data: "data/tourismSite.geojson",
  });

  map.addLayer({
    id: "tourism",
    type: "symbol",
    source: "TourismSource",
    layout: {
      visibility: "none",
      "icon-image": "point",
      "icon-allow-overlap": true,
    },
  });

  map.addSource("evacSource", {
    type: "geojson",
    data: "data/evacSite.geojson",
  });

  map.addLayer({
    id: "evac",
    type: "symbol",
    source: "evacSource",
    layout: {
      visibility: "none",
      "icon-image": "evakuasi",
      "icon-allow-overlap": true,
    },
  });

  map.addSource("mapbox-dem", {
    type: "raster-dem",
    url: "mapbox://mapbox.mapbox-terrain-dem-v1",
    tileSize: 512,
    maxzoom: 14,
  });
  // add the DEM source as a terrain layer with exaggerated height
  map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

  // add a sky layer that will show when the map is highly pitched
  map.addLayer({
    id: "sky",
    type: "sky",
    paint: {
      "sky-type": "atmosphere",
      "sky-atmosphere-sun": [0.0, 0.0],
      "sky-atmosphere-sun-intensity": 15,
    },
  });

  map.addSource("nearest-site", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  });

  map.addLayer(
    {
      id: "nearest-site",
      type: "circle",
      source: "nearest-site",
      paint: {
        "circle-radius": 19,
        "circle-color": "#a32424",
      },
    },
    "evac"
  );
});

var cards = {
  cardA: {
    bearing: 27,
    center: [115.132799, -8.358901],
    zoom: 9,
    pitch: 45,
  },
  cardB: {
    duration: 6000,
    center: [115.507239, -8.343868],
    bearing: 45,
    zoom: 13,
    pitch: 70,
  },
  cardC: {
    duration: 6000,
    bearing: 60,
    center: [115.507239, -8.343868],
    zoom: 11,
    speed: 0.6,
    pitch: 40,
  },
  cardD: {
    duration: 6000,
    bearing: 0,
    center: [115.507239, -8.343868],
    zoom: 10,
  },
  cardE: {
    duration: 6000,
    bearing: 0,
    center: [115.507239, -8.343868],
    zoom: 10,
  },
};

var marker = new mapboxgl.Marker({
  draggable: true,
}).setLngLat([map.getCenter().lng, map.getCenter().lat]);

const mapModifier = (cardElement) => {
  if (cardElement === activeElement) return;

  if (activeElement === "cardA") {
    map.setLayoutProperty("hazard", "visibility", "none");
    map.setLayoutProperty("evac", "visibility", "none");
    map.setLayoutProperty("tourism", "visibility", "none");
    map.setLayoutProperty("isoLayer", "visibility", "none");
    map.setLayoutProperty("nearest-site", "visibility", "none");
    marker.remove();
  } else if (activeElement === "cardB") {
    map.setLayoutProperty("hazard", "visibility", "none");
    map.setLayoutProperty("evac", "visibility", "none");
    map.setLayoutProperty("tourism", "visibility", "none");
    map.setLayoutProperty("isoLayer", "visibility", "none");
    map.setLayoutProperty("nearest-site", "visibility", "none");
    marker.remove();
  } else if (activeElement === "cardC") {
    map.setLayoutProperty("hazard", "visibility", "visible");
    map.setLayoutProperty("evac", "visibility", "none");
    map.setLayoutProperty("tourism", "visibility", "none");
    map.setLayoutProperty("isoLayer", "visibility", "none");
    map.setLayoutProperty("nearest-site", "visibility", "none");
    marker.remove();
  } else if (activeElement === "cardD") {
    // map.setLayoutProperty("hazard", "visibility", "none");
    map.setLayoutProperty("evac", "visibility", "none");
    map.setLayoutProperty("tourism", "visibility", "visible");
    map.setLayoutProperty("isoLayer", "visibility", "none");
    map.setLayoutProperty("nearest-site", "visibility", "none");
    marker.remove();
  } else if (activeElement === "cardE") {
    // map.setLayoutProperty("hazard", "visibility", "none");
    map.setLayoutProperty("evac", "visibility", "visible");
    // map.setLayoutProperty("tourism", "visibility", "none");
    map.setLayoutProperty("isoLayer", "visibility", "visible");
    map.setLayoutProperty("nearest-site", "visibility", "visible");

    marker.addTo(map);
    marker.setLngLat([map.getCenter().lng, map.getCenter().lat]);
    // console.log("trigger");
  }
};

const element = ["cardA", "cardB", "cardC", "cardD", "cardE"];
var myElement = document.getElementById("cardInfo");
myElement.addEventListener("scroll", () => {
  for (i = 0; i < element.length; i++) {
    isElementOnScreen(element[i]);
  }
});

function isElementOnScreen(id) {
  var anchor = document.getElementById("cardInfo");
  var anchorBounds = anchor.getBoundingClientRect();
  var element = document.getElementById(id);
  var bounds = element.getBoundingClientRect();
  var calc = bounds.top - anchorBounds.top;

  // console.log(id, calc);

  //desktop
  if (windowWidth > 768) {
    if (calc > -100 && 32 > calc) {
      checkActiveCard(id);
    }
  } else {
    //mobile
    if (bounds.y > 500 && bounds.y < 550) {
      checkActiveCard(id);
    }
  }
}

let activeElement = "cardA";
function checkActiveCard(id) {
  if (activeElement != id) {
    activeElement = id;
    // console.log(activeElement);
    mapModifier();

    for (i = 0; i < element.length; i++) {
      $("#" + element[i]).removeClass("cardActive");
    }

    $("#" + activeElement).addClass("cardActive");

    map.flyTo(cards[activeElement]);
  }
}

const toggle = document.querySelector("#toggle");
var toggleVal = true;
toggle.addEventListener("click", () => {
  toggleVal = !toggleVal;

  const showIcon = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>`;
  const hideIcon = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>`;

  if (toggleVal) {
    $("#cardInfo").slideToggle();
    toggle.innerHTML = hideIcon;
    if (windowWidth > 768) {
      map.easeTo({ padding: { left: 0, right: 150 } });
    }
  } else {
    $("#cardInfo").slideToggle();
    toggle.innerHTML = showIcon;
    if (windowWidth > 768) {
      map.easeTo({ padding: { right: 0, left: 150 } });
    }
  }
});

//data
var tourism = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.657635, -8.335425],
      },
      properties: {
        id: 4,
        name: "Amed Beach",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.480083, -8.550526],
      },
      properties: {
        id: 1,
        name: "Pantai Wates Karangasem",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.61054, -8.501408],
      },
      properties: {
        id: 2,
        name: "Virgin Beach, Karangasem, Bali",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.508899, -8.53616],
      },
      properties: {
        id: 3,
        name: "Bias Tugel Beach",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.597351, -8.278681],
      },
      properties: {
        id: 5,
        name: "Pantai Tulamben",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.513304, -8.529798],
      },
      properties: {
        id: 6,
        name: "Blue Lagoon Beach",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.617079, -8.483598],
      },
      properties: {
        id: 7,
        name: "Pantai Sosro",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.630754, -8.47254],
      },
      properties: {
        id: 8,
        name: "Pantai Jasri",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.509638, -8.530658],
      },
      properties: {
        id: 9,
        name: "Padang Bai Beach",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.617018, -8.483775],
      },
      properties: {
        id: 10,
        name: "Charlys Chocolate",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.587292, -8.412347],
      },
      properties: {
        id: 11,
        name: "Taman Tirtagangga",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.450928, -8.374343],
      },
      properties: {
        id: 12,
        name: "Besakih Temple",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.43412, -8.423322],
      },
      properties: {
        id: 13,
        name: "Telaga Waja Rafting Bali",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.62914, -8.462331],
      },
      properties: {
        id: 14,
        name: "Taman Ujung Resort & Spa",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.555524, -8.499535],
      },
      properties: {
        id: 15,
        name: "Candi Dasa",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.565148, -8.471739],
      },
      properties: {
        id: 16,
        name: "Tenganan",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.507411, -8.529898],
      },
      properties: {
        id: 17,
        name: "Padangbai",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.508899, -8.53616],
      },
      properties: {
        id: 18,
        name: "Bias Tugel Beach",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.631208, -8.391625],
      },
      properties: {
        id: 19,
        name: "Pura Penataran Agung Lempuyang",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.568691, -8.318554],
      },
      properties: {
        id: 21,
        name: "Rumah Pohon",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.617098, -8.48366],
      },
      properties: {
        id: 22,
        name: "Rumah Coklat",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.610589, -8.505565],
      },
      properties: {
        id: 23,
        name: "Bukit Asah Desa Bugbug",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.616006, -8.443668],
      },
      properties: {
        id: 24,
        name: "Puri Agung Karangasem",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.592388, -8.423234],
      },
      properties: {
        id: 25,
        name: "Rumah Pohon Temega",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.593084, -8.424808],
      },
      properties: {
        id: 26,
        name: "Houses Tree Hill Lemped",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.683881, -8.350792],
      },
      properties: {
        id: 27,
        name: "Lipah Beach",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.519167, -8.407778],
      },
      properties: {
        id: 28,
        name: "Bukit Cemara",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.44203, -8.479304],
      },
      properties: {
        id: 29,
        name: "Subak Tabola Villa",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.525794, -8.41562],
      },
      properties: {
        id: 30,
        name: "Bukit Surga",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.516585, -8.46175],
      },
      properties: {
        id: 31,
        name: "Bukit Putung",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.510225, -8.459305],
      },
      properties: {
        id: 32,
        name: "Air Terjun Jagasatru, Jagasatru Waterfall",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.533488, -8.463724],
      },
      properties: {
        id: 33,
        name: "Air Terjun Yeh Labuh",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.459524, -8.373439],
      },
      properties: {
        id: 34,
        name: "Taman jinja bali",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.463665, -8.369119],
      },
      properties: {
        id: 35,
        name: "Taman Edelweis Bali",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.467187, -8.366026],
      },
      properties: {
        id: 36,
        name: "Padang Bunga Kasna",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.525624, -8.456228],
      },
      properties: {
        id: 37,
        name: "Bukit Pemukuran",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.706779, -8.398539],
      },
      properties: {
        id: 38,
        name: "mencol temple seraya timur",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.488163, -8.537544],
      },
      properties: {
        id: 39,
        name: "Ceeng Hill",
        description: null,
        timestamp: null,
        begin: null,
        end: null,
        altitudemode: null,
        tessellate: -1,
        extrude: 0,
        visibility: -1,
        draworder: null,
        icon: null,
      },
    },
  ],
};
var evac = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.516412, -8.505673],
      },
      properties: {
        id: 1,
        id: 0,
        nama: "Pos evac Akhir",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.401112, -8.535143],
      },
      properties: {
        id: 2,
        id: 0,
        nama: "Pos evac Akhir",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.612053, -8.43935],
      },
      properties: {
        id: 3,
        id: 0,
        nama: "Pos evac Akhir",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.412402, -8.353526],
      },
      properties: {
        id: 4,
        id: 0,
        nama: "Pos Pantau - evac Awal",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.41775, -8.371751],
      },
      properties: {
        id: 5,
        id: 0,
        nama: "Pos Pantau - evac Awal",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.419533, -8.394089],
      },
      properties: {
        id: 6,
        id: 0,
        nama: "Pos Pantau - evac Awal",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.421909, -8.410548],
      },
      properties: {
        id: 7,
        id: 0,
        nama: "Pos Pantau - evac Awal",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.434388, -8.420541],
      },
      properties: {
        id: 8,
        id: 0,
        nama: "Pos Pantau - evac Awal",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.443301, -8.428182],
      },
      properties: {
        id: 9,
        id: 0,
        nama: "Pos Pantau - evac Awal",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.491431, -8.447578],
      },
      properties: {
        id: 10,
        id: 0,
        nama: "Pos Pantau - evac Awal",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.519358, -8.440525],
      },
      properties: {
        id: 11,
        id: 0,
        nama: "Pos Pantau - evac Awal",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.539561, -8.438762],
      },
      properties: {
        id: 12,
        id: 0,
        nama: "Pos Pantau - evac Awal",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.559764, -8.440525],
      },
      properties: {
        id: 13,
        id: 0,
        nama: "Pos Pantau - evac Awal",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.568677, -8.429358],
      },
      properties: {
        id: 14,
        id: 0,
        nama: "Pos Pantau - evac Awal",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.57759, -8.42348],
      },
      properties: {
        id: 15,
        id: 0,
        nama: "Pos Pantau - evac Awal",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.579966, -8.379393],
      },
      properties: {
        id: 16,
        id: 0,
        nama: "Pos Pantau - evac Awal",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.588879, -8.351763],
      },
      properties: {
        id: 17,
        id: 0,
        nama: "Pos Pantau - evac Awal",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [115.498304, -8.202957],
      },
      properties: {
        id: 18,
        id: 0,
        nama: "Pos Pantau - evac Awal",
      },
    },
  ],
};

map.on("click", function (e) {
  // console.log("e");
  var tourismFeatures = map.queryRenderedFeatures(e.point, {
    layers: ["tourism"],
  });
  if (!tourismFeatures.length) {
    return;
  }
  // console.log(tourismFeatures);

  var tourismFeature = tourismFeatures[0];

  var nearestSite = turf.nearest(tourismFeature, evac);

  if (nearestSite != null) {
    map.getSource("nearest-site").setData({
      type: "FeatureCollection",
      features: [nearestSite],
    });
  }
});

//mouse interaction

var popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
});
//ini kalo hover di tourism
map.on("mouseenter", "tourism", function (e) {
  // Change the cursor style as a UI indicator.
  map.getCanvas().style.cursor = "pointer";

  // Populate the popup and set its coordinates
  // based on the feature found.
  popup
    .setLngLat(e.features[0].geometry.coordinates)
    .setHTML(
      "<strong>" +
        "Tourism Object" +
        "</strong>" +
        "<br>" +
        e.features[0].properties["name"]
    )
    .addTo(map);
});

map.on("mouseleave", "tourism", function () {
  map.getCanvas().style.cursor = "";
  popup.remove();
});

map.on("mouseenter", "evac", function (e) {
  // Change the cursor style as a UI indicator.
  map.getCanvas().style.cursor = "pointer";

  // Populate the popup and set its coordinates
  // based on the feature found.
  popup
    .setLngLat(e.features[0].geometry.coordinates)
    .setHTML(
      "<strong>" +
        "Evacuation Site" +
        "</strong>" +
        "<br>" +
        e.features[0].properties["nama"]
    )
    .addTo(map);
});

map.on("mouseleave", "evac", function () {
  map.getCanvas().style.cursor = "";
  popup.remove();
});

//isochrone
function showIso() {
  var profile = "walking";
  var minutes = "20,40,60";
  var lngLat = marker.getLngLat();

  var urlBase = "https://api.mapbox.com/isochrone/v1/mapbox/";
  var lon = lngLat.lng;
  var lat = lngLat.lat;

  // Make the API call
  var query =
    urlBase +
    profile +
    "/" +
    lon +
    "," +
    lat +
    "?contours_minutes=" +
    minutes +
    "&polygons=true&access_token=" +
    mapboxgl.accessToken;

  $.ajax({
    method: "GET",
    url: query,
  }).done(function (data) {
    // Set the 'iso' source's data to what's returned by the API query
    map.getSource("iso").setData(data);
    // console.log(data)
  });

  // console.log(lngLat.lng);
}

marker.on("dragend", showIso);

function removeiso() {
  marker.remove();
  // map.removeLayer('isoLayer')
  // map.removeSource('iso')
}
