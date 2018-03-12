(function() {

  L.mapbox.accessToken = 'pk.eyJ1Ijoicmdkb25vaHVlIiwiYSI6Im5Ua3F4UzgifQ.PClcVzU5OUj17kuxqsY_Dg';

  var map = L.mapbox.map('map', 'mapbox.light', {
    zoomSnap: .1,
    center: [27.92, -83.91],
    zoom: 7,
    dragging: true,
    zoomControl: true,
    intertia: true
    //mapbox.light to adjust basemap later on
  });

  omnivore.csv('data/hab_events_2007-2015_10000_min.csv')
    .on('ready', function(e) {
      console.log(e.target.toGeoJSON())
    })
    .on('error', function(e) {
      console.log(e.error[0].message);
    }).addTo(map);


  var legendControl = L.control({
    position: 'bottomright'
  });

  legendControl.onAdd = function(map) {

    var legend = L.DomUtil.get("legend");

    L.DomEvent.disableScrollPropagation(legend);
    L.DomEvent.disableClickPropagation(legend);

    return legend;

  }

  legendControl.addTo(map);

  var sliderControl = L.control({
    position: 'bottomleft'
  });

  sliderControl.onAdd = function(map) {

    var controls = L.DomUtil.get("slider");

    L.DomEvent.disableScrollPropagation(controls);
    L.DomEvent.disableClickPropagation(controls);

    return controls;

  }

  sliderControl.addTo(map);

})();
