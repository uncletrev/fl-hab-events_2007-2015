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
          fillOpacity: .6,
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

  function resizeCircles(dataLayer, val) {

    dataLayer.eachLayer(function(layer) {
      var radius = calcRadius(Number(layer.feature.properties['Count_']));
      layer.setRadius(radius);

      // var date = layer.feature.properties.DATE;
      //     date = date.slice(-4, date.length)

      if(+layer.feature.properties.YEAR != val) {
        layer.setStyle({
          opacity: 0,
          fillOpacity: 0
        })
      } else {
        layer.setStyle({
          opacity: 1,
          fillOpacity: 1
        })
      }
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

    sliderControl.addTo(map);

    $('#slider input[type=range]')
      .on('input change', function() {
      
        //var sampleYears = 

        //["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"]

        resizeCircles(dataLayer, this.value);

      });

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
