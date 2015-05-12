/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 OA Wu Design
 */

(function () {
  function funcs (option) {
    var _map = null;
    var _markerInfos = null;
    var _polyline = null;

    var circlePath = function (r) {
      return 'M 0 0 m -' + r + ', 0 '+
             'a ' + r + ',' + r + ' 0 1,0 ' + (r * 2) + ',0 ' +
             'a ' + r + ',' + r + ' 0 1,0 -' + (r * 2) + ',0';
    };

    var userPath = function () {
      return 'm-16,0 ' +
             'a16,5 0 1 0 32,0 ' +
             'l-11,-24 ' +
             'a12.5,12.5 0 1 0 -6,0 ' +
             'l-14,25';
    };

    var getUnit = function (will, now) {
      var addLat = will.lat () - now.lat ();
      var addLng = will.lng () - now.lng ();
      var aveAdd = ((Math.abs (addLat) + Math.abs (addLng)) / 2);
      var unit = aveAdd < 10 ? aveAdd < 1 ? aveAdd < 0.1 ? aveAdd < 0.01 ? aveAdd < 0.001 ? aveAdd < 0.0001 ? 3 : 6 : 9 : 12 : 15 : 24 : 21;
      var lat = addLat / unit;
      var lng = addLng / unit;

      if (!((Math.abs (lat) > 0) || (Math.abs (lng) > 0)))
        return null;

      return {
        unit: unit,
        lat: lat,
        lng: lng
      };
    };

    var mapMove = function (unitLat, unitLng, unitCount, unit, callback) {
      if (unit > unitCount) {
        _map.setCenter (new google.maps.LatLng (_map.getCenter ().lat () + unitLat, _map.getCenter ().lng () + unitLng));
        setTimeout (function () {
          mapMove (unitLat, unitLng, unitCount + 1, unit, callback);
        }, 50);
      } else {
        if (callback)
          callback ();
      }
    };

    var mapGo = function (will, callback) {
      var now = _map.getCenter ();

      var Unit = getUnit (will, now);
      if (!Unit)
        return false;

      mapMove (Unit.lat, Unit.lng, 0, Unit.unit, callback);
    };


    this.initMap = function ($map, option) {
      option = $.extend ({
        zoom: 16,
        scaleControl: true,
        navigationControl: false,
        disableDoubleClickZoom: true,
        mapTypeControl: false,
        zoomControl: false,
        scrollwheel: false,
        streetViewControl: false,
        center: new google.maps.LatLng (23.568038757736595, 120.30465692281723),
      }, option);

      _map = new google.maps.Map ($map.get (0), option);
      return this;
    };

    this.markerInfoToBuild = function () {
      this.layer += 1;

      var prevHeading = (360 + google.maps.geometry.spherical.computeHeading (this.getPosition (), this.prev.getPosition ())) % 360;
      var nextHeading = (360 + google.maps.geometry.spherical.computeHeading (this.getPosition (), this.next.getPosition ())) % 360;
      var heading = Math.abs (nextHeading - prevHeading);

      if (heading < 180)
        heading = Math.max (prevHeading, nextHeading) + (360 - heading) / 2;
      else
        heading = Math.min (prevHeading, nextHeading) + heading / 2;

      if(this.build)
        this.build.setMap (null);

      this.build = new google.maps.Marker ({
        map: _map,
        draggable: false,
        position: google.maps.geometry.spherical.computeOffset (this.getPosition (), 80, heading),
        icon: 'img/map/House-' + this.layer + '-icon.png'
      });



    };

    this.initMarkerInfos = function (markerInfos) {
      var that = this;
      _markerInfos = markerInfos.map (function (t, i) {
        t.i = i;
        t.next = markerInfos[(i + 1) % markerInfos.length];
        t.prev = markerInfos[(i + markerInfos.length - 1) % markerInfos.length];

        t.userCount = 0;
        t.getPosition = function () { return this.position; };
        t.setPosition = function (p) { if (this.marker) this.marker.setPosition (p); return this; };
        t.owner = null;
        t.price = t.price;
        t.title = t.title;
        t.layer = 0;
        t.toBuild = that.markerInfoToBuild;

        t.marker = new google.maps.Marker ({
          map: _map,
          draggable: false,
          position: t.position,
          icon: {
            path: circlePath (20),
            strokeColor: 'rgba(50, 60, 140, 1)',
            strokeWeight: 1,
            fillColor: 'rgba(68, 77, 145, .85)',
            fillOpacity: 0.5
          }
        });

        return t;
      });
      return this;
    };

    this.initPolyline = function () {
      _polyline = new google.maps.Polyline ({
        map: _map,
        path: _markerInfos.map (function (t) { return t.marker.getPosition (); }),
        strokeColor: 'rgba(102, 217, 239, .5)',
        strokeWeight: 10
      });
      return this;
    };

    this.init = function ($map, markerInfos) {
      try {
        this.initMap ($map)
            .initMarkerInfos (markerInfos)
            .initPolyline ();

        return _map && _markerInfos && _polyline ? true : false;
      } catch (err) { return false; }
    };

    this.setUserPosition = function (position) {

      if (position) {
        this.marker.setPosition (position);
        return this;
      }

      if (!_markerInfos[this.index])
        return false;

      switch (_markerInfos[this.index].userCount) {
        case 0:
          position = new google.maps.LatLng (_markerInfos[this.index].getPosition ().lat (), _markerInfos[this.index].getPosition ().lng ());
          break;

        case 1:
          position = new google.maps.LatLng (_markerInfos[this.index].getPosition ().lat (), _markerInfos[this.index].getPosition ().lng () + 0.0005);
          break;

        case 2:
          position = new google.maps.LatLng (_markerInfos[this.index].getPosition ().lat (), _markerInfos[this.index].getPosition ().lng () - 0.0005);
          break;

        case 3:
          position = new google.maps.LatLng (_markerInfos[this.index].getPosition ().lat () + 0.0005, _markerInfos[this.index].getPosition ().lng ());
          break;

        case 4:
          position = new google.maps.LatLng (_markerInfos[this.index].getPosition ().lat () - 0.0005, _markerInfos[this.index].getPosition ().lng ());
          break;
      }

      if (!position)
        return false;

      this.marker.setPosition (position);
      _markerInfos[this.index].userCount += 1;

      return this;
    };

    this.userBuy = function (markerInfo) {
      if (markerInfo.owner && markerInfo.owner != this)
        return false;


      if (!confirm ('是否購買' + markerInfo.title + '(' + markerInfo.price + '元)？')) {
        markerInfo.owner = null;
        return true;
      }

      markerInfo.owner = this;
      markerInfo.toBuild ();

      return true;
    };
    this.userGoStop = function () {
      this.setPosition ();
      mapGo (this.getPosition (), !_markerInfos[this.index].owner || (_markerInfos[this.index].owner == this) ? this.buy.bind (this, _markerInfos[this.index]) : null);
    };

    this.userMove = function (step, unitLat, unitLng, unitCount, unit) {
      if (unit <= unitCount) {
        this.index = (this.index + 1) % _markerInfos.length;

        if (step > 1) {
          return this.goStep (step - 1);
        } else {
            this.goStop ();
        }
        return true;
      } else {
        this.setPosition (new google.maps.LatLng (this.getPosition ().lat () + unitLat, this.getPosition ().lng () + unitLng));

        setTimeout (function () {
          this.move (step, unitLat, unitLng, unitCount + 1, unit);
        }.bind (this), 50);
      }
    };
    this.userGoStep = function (step) {
      if (step < 1)
        return false;

      var now = this.getPosition ();
      var will = _markerInfos[(this.index + 1) % _markerInfos.length].getPosition ();

      var Unit = getUnit (will, now);
      if (!Unit)
        return false;

      _markerInfos[this.index].userCount -= 1;
      this.move (step, Unit.lat, Unit.lng, 0, Unit.unit);
    };

    this.createUser = function () {
      return {
        index: 0,
        move: this.userMove,
        goStep: this.userGoStep,
        goStop: this.userGoStop,
        buy: this.userBuy,
        setPosition: this.setUserPosition,
        getPosition: function () { return this.marker ? this.marker.getPosition () : null; },
        marker: new google.maps.Marker ({
            map: _map,
            draggable: false,
            icon: {
              path: userPath (),
              strokeColor: 'rgba(200, 0, 0, .9)',
              strokeWeight: 1,
              fillColor: 'rgba(200, 0, 0, .9)',
              fillOpacity: 0.5
            }
          })};
    };
  }

  window.funcs = funcs;
})();