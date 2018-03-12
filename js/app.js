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

})();
