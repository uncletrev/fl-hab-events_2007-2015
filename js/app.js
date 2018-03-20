(function(map) {

  L.mapbox.accessToken = 'pk.eyJ1Ijoicmdkb25vaHVlIiwiYSI6Im5Ua3F4UzgifQ.PClcVzU5OUj17kuxqsY_Dg';

  var map = L.mapbox.map('map', 'mapbox.dark', {

    zoomSnap: .5,
    center: [26.92, -83.86],
    zoom: 7.25,
    dragging: true,
    zoomControl: true,
    intertia: true
  });

  omnivore.csv('data/hab_events_2007-2015_10000_min.csv')
    .on('ready', function(e) {
      drawMap(e.target.toGeoJSON());
      drawLegend(e.target.toGeoJSON());
    })
    .on('error', function(e) {
    });

  function drawMap(data) {

    var options = {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 1.5,
          opacity: 1,
          weight: 2,
          fillOpacity: 1,
          color: getColor(feature.properties.Count_)
        });
      }
    }

    var dataLayer = L.geoJson(data, options).addTo(map);

    map.fitBounds(dataLayer.getBounds());

    map.setZoom(map.getZoom() - .4);

    //console.log(data);

    resizeCircles(dataLayer, 2007);

    sequenceUI(dataLayer);

  }

  function calcRadius(val) {
    var radius = Math.sqrt(val / Math.PI);
    return radius * .008
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
      .on('input', function() {

    $('#year span').html(this.value);
        resizeCircles(dataLayer, this.value);

      });

    var sliderControl = L.control({
      position: 'bottomleft'
    });

    sliderControl.onAdd = function(map) {

      var slider = L.DomUtil.get("year");

      L.DomEvent.disableScrollPropagation(slider);
      L.DomEvent.disableClickPropagation(slider);

      return slider;

    }

    sliderControl.addTo(map);

  }

  function getColor(val) {
    if (val < 99999) {
      return "yellow"
    } else if (val < 999999) {
      return "orange"
    } else if (val > 999999) {
      return "red"
    }
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

    var dataValues = data.features.map(function(samples) {
      return +samples.properties.Count_

    });

    //console.log(dataValues);

    var sortedValues = dataValues.sort(function(a, b) {
      return b - a;
    });

    //console.log(sortedValues);

    var maxValue = Math.round(sortedValues[8] / 1000) * 1000;

    //console.log(maxValue);

    var largeDiameter = calcRadius(maxValue) * 2,
      smallDiameter = largeDiameter / 2;

    $(".legend-circles").css('height', largeDiameter.toFixed());

    $('.legend-large').css({
      'width': largeDiameter.toFixed(),
      'height': largeDiameter.toFixed(),
    });

    $('.legend-small').css({
      'width': smallDiameter.toFixed(),
      'height': smallDiameter.toFixed(),
      'top': largeDiameter - smallDiameter,
      'left': smallDiameter / 2
    })

    $(".legend-large-label").html(maxValue.toLocaleString());
    $(".legend-small-label").html((maxValue / 2).toLocaleString());

    $(".legend-large-label").css({
      'top': -11,
      'left': largeDiameter + 30,
    });

    $(".legend-small-label").css({
      'top': smallDiameter - 11,
      'left': largeDiameter + 30
    });

    $("<hr class='large'>").insertBefore(".legend-large-label")
    $("<hr class='small'>").insertBefore(".legend-small-label").css('top', largeDiameter - smallDiameter - 8);
  }

  function sequenceYear(dataLayer) {

    var yearSelect = L.control({
      position: 'bottomleft'
    });

    sliderControl.onAdd = function(map) {

      var controls = L.DomUtil.get("year");

      L.DomEvent.disableScrollPropagation(slider);
      L.DomEvent.disableClickPropagation(slider);

      return controls;

    }

    $('#year span').html(dataLayer)
      .on('input', function() {
        var controls = this.value;

        resizeCircles(dataLayer, this.value);

      });

    sliderControl.addTo(map);

  }

  function resizeCircles(dataLayer, val) {

    dataLayer.eachLayer(function(layer) {

      var props = layer.feature.properties;

      var tooltipInfo = "<b>" + "Sample Date: " + props["SAMPLE_DAT"] + "</b></br>" + "<b>" + "Location: " + props["LOCATION"] + "</b></br>" + "<b>" + "Karenia brevis Count: " + Number(layer.feature.properties.Count_).toLocaleString() + " cells/liter" + "</b></br>" + "<b>" + "Depth of Sample: " + props["DEPTH"] + " feet" + "</b></br>" + "<b>" + "Karenia brevis Presence: " + props["COUNT_CLASS"]

      var radius = calcRadius(Number(layer.feature.properties['Count_']));
      layer.setRadius(radius);

      if (+layer.feature.properties.YEAR != val) {
        layer.setStyle({
          opacity: 0,
          fillOpacity: 0
        })
        layer.unbindTooltip();
      } else {
        layer.setStyle({
          opacity: 1.0,
          fillOpacity: 0.7
        })
        layer.bindTooltip(tooltipInfo, {
          sticky: true,
          tooltipAnchor: [300, 300]
        });
      }

    });
  }

})(map);
