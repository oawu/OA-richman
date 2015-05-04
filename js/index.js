/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 OA Wu Design
 */
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-46121102-7', 'auto');
ga('send', 'pageview');

$(function () {
  var now = document.URL.replace (/^.*[\\\/]/, '');
  var $map = $('#map');
  var map = null;
  var $run = $('.run');
  var $cube = $('#cube');
  var $dice = $('#dice');
  var ni = 0;
  var $loading = $('<div />').attr ('id', 'loading').append ($('<div />')).appendTo ($('body'));
  var user;
  var markers = [
        new google.maps.LatLng (23.568038757736595, 120.30465692281723), new google.maps.LatLng (23.565363909701762, 120.30417948961258), new google.maps.LatLng (23.564550135385016, 120.30402392148972), new google.maps.LatLng (23.565029549867546, 120.30180037021637), new google.maps.LatLng (23.56839031919102, 120.30243337154388), new google.maps.LatLng (23.568697627383873, 120.30138731002808), new google.maps.LatLng (23.57121506902716, 120.30256748199463), new google.maps.LatLng (23.572736819430755, 120.29828935861588), new google.maps.LatLng (23.5747059726961, 120.29707431793213), new google.maps.LatLng (23.576242432573448, 120.3018781542778), new google.maps.LatLng (23.57265323424432, 120.30320584774017), new google.maps.LatLng (23.57215172200842, 120.3030127286911), new google.maps.LatLng (23.571478119226718, 120.30489563941956), new google.maps.LatLng (23.569523668242216, 120.30414193868637), new google.maps.LatLng (23.568901679626702, 120.30510485172272), new google.maps.LatLng (23.56844932241981, 120.30482053756714), new google.maps.LatLng (23.568038757736595, 120.30465692281723)
      ];

  function circlePath (r) { return 'M 0 0 m -' + r + ', 0 a ' + r + ',' + r + ' 0 1,0 ' + (r * 2) + ',0 a ' + r + ',' + r + ' 0 1,0 -' + (r * 2) + ',0'; }
  function userPath (r) { return 'm-16,0 a16,5 0 1 0 32,0 l-11,-24 a12.5,12.5 0 1 0 -6,0 l-14,25'; }

  function moveMap (a, uLat, uLng, i, c) {
    map.setCenter (new google.maps.LatLng (a.lat () + uLat * i, a.lng () + uLng * i));

    if (i < c)
      setTimeout (function () { moveMap (a, uLat, uLng, i + 1, c); }, 50);
    else
      $dice.prop ('disabled', false);
  }
  function go (count) {

    ni += 1;
    ni %= (markers.length - 1);
    
    var a = user.getPosition ();
    var b = markers[ni].position;
    var mLat = b.lat () - a.lat ();
    var mLng = b.lng () - a.lng ();
    var r = ((Math.abs (mLat) + Math.abs (mLng)) / 2);
    var c = r < 10 ? r < 1 ? r < 0.1 ? r < 0.01 ? r < 0.001 ? r < 0.0001 ? 3 : 6 : 9 : 12 : 15 : 24 : 21;

    var uLat = mLat / c;
    var uLng = mLng / c;

    if (count <= 0) {
      ni -= 1;

      b = map.getCenter ();
      mLat = a.lat () - b.lat ();
      mLng = a.lng () - b.lng ();
      r = ((Math.abs (mLat) + Math.abs (mLng)) / 2);
      c = r < 10 ? r < 1 ? r < 0.1 ? r < 0.01 ? r < 0.001 ? r < 0.0001 ? 3 : 6 : 9 : 12 : 15 : 24 : 21;

      uLat = mLat / c;
      uLng = mLng / c;

      return moveMap (b, uLat, uLng, 0, c);
    }
    moveMarker (user, a, uLat, uLng, 0, c, count);
  }
  function moveMarker (user, a, uLat, uLng, i, c, count) {
    user.setPosition (new google.maps.LatLng (a.lat () + uLat * i, a.lng () + uLng * i));
    if (i < c) {
      setTimeout (function () { moveMarker (user, a, uLat, uLng, i + 1, c, count); }, 50);
    } else {
      if (count > 0) go (count - 1);
    }
  }

  function initialize () {
    var mapOptions = {
      zoom: 16,
      scaleControl: true,
      navigationControl: false,
      mapTypeControl: false,
      zoomControl: true,
      scrollwheel: true,
      streetViewControl: false,
      center: markers[0],
    };

    map = new google.maps.Map ($map.get (0), mapOptions);

    markers = markers.map (function (t, i) {
      return new google.maps.Marker ({
        map: map,
        draggable: false,
        position: t,
        icon: {
          path: circlePath (15),
          strokeColor: 'rgba(50, 60, 140, 1)',
          strokeWeight: 1,
          fillColor: 'rgba(68, 77, 145, .85)',
          fillOpacity: 0.5
        }
      });
    });

    Polyline = new google.maps.Polyline ({
      strokeColor: 'rgba(102, 217, 239, .5)',
      strokeWeight: 15,
      path: markers.map (function (t) { return t.getPosition (); }),
      map: map,
      icons: [{
        offset: '100%'
      }]
    });

    user = new google.maps.Marker ({
      map: map,
      draggable: false,
      position: markers[ni].position,
      icon: {
        path: userPath (),
        strokeColor: 'rgba(200, 0, 0, .9)',
        strokeWeight: 1,
        fillColor: 'rgba(200, 0, 0, .9)',
        fillOpacity: 0.5
      }
    });

    $dice.OAjelly ().click (function () {
      $dice.prop ('disabled', true);
      $cube.attr ('class', 'show' + Math.floor ((Math.random () * 6) + 1));

      $run.fadeIn (function () {
      var cube = Math.floor ((Math.random () * 6) + 1);
        $cube.attr ('class', 'show' + cube);

        setTimeout (function () {
          $run.fadeOut (function () {
            go (cube);
          });
        }, 700);
      });
    });


    $loading.fadeOut (function () {
      $(this).hide (function () {
        $(this).remove ();
      });
    });
  }

  google.maps.event.addDomListener (window, 'load', initialize);

});