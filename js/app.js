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
      drawMap(e.target.toGeoJSON());
    })
    .on('error', function(e) {
      console.log(e.error[0].message);
    });

  function drawMap(data) {

    var options = {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 1.5,
          opacity: 1,
          weight: 2,
          fillOpacity: 1,
        })
      }
    }

    var dataLayer = L.geoJson(data, options).addTo(map);

    map.fitBounds(dataLayer.getBounds());

    map.setZoom(map.getZoom() - .4);

    console.log(data);

    resizeCircles(dataLayer, 2007);

    sequenceUI(dataLayer);

  }

  function calcRadius(val) {
    var radius = Math.sqrt(val / Math.PI);
    return radius * .003
  }

  function resizeCircles(dataLayer) {

    dataLayer.eachLayer(function(layer) {
      var radius = calcRadius(Number(layer.feature.properties['Count_']));
      layer.setRadius(radius);
    });
  }

  function sequenceUI(dataLayer) {

    var sliderControl = L.control({
      position: 'bottomleft'
    });

    sliderControl.onAdd = function(map) {

      var slider = L.DomUtil.get("slider");

      L.DomEvent.disableScrollPropagation(slider);
      L.DomEvent.disableClickPropagation(slider);

      return slider;

    }

    $('#slider input[type=range]')
      .on('input', function() {
        var currentYear = this.value;

        resizeCircles(dataLayer, currentYear);

      });


    sliderControl.addTo(map);

  }

  function drawLegend(data) {

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

  }


})();
