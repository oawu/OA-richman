/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 OA Wu Design
 */

(function () {
  function funcs (option) {
    var _map = null;
    var _markerInfos = null;
    var _polyline = null;
    var $_logs = null;
    var _userCount = 0;

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
    var nowTime = function () {
      var d = new Date ();
      // return d.getFullYear () + '-' + ("0" + (d.getMonth () + 1)).slice (-2) + '-' + ('0' + d.getDate ()).slice (-2) + ' ' + d.getHours () + ':' + d.getMinutes () + ':' + d.getSeconds ();
      return d.getHours () + ':' + d.getMinutes () + ':' + d.getSeconds ();
    };
    var logs = function (text, className) {
      if (!($_logs && text))
        return;

      if (className === 'title')
        $_logs.append ($('<div />').addClass ('title').text (text));
      else
        $_logs.append ($('<div />').addClass ('log').append ($('<div />').addClass ('l').text (text)).append ($('<div />').addClass ('r').text (nowTime ())));

      var _logs = $_logs.get (0);
      _logs.scrollTop = _logs.scrollHeight;
    };

    this.logs = logs;

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

    this.markerInfoToBuild = function (user) {
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
        icon: 'img/map/build/h' + user.id + '_' + this.layer + '.png'
      });

      return true;
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
        path: _markerInfos.map (function (t) { return t.marker.getPosition (); }).concat ([_markerInfos[0].marker.getPosition ()]),
        strokeColor: 'rgba(102, 217, 239, .5)',
        strokeWeight: 10
      });
      return this;
    };

    this.init = function ($map, markerInfos, $logs) {
      try {
        this.initMap ($map)
            .initMarkerInfos (markerInfos)
            .initPolyline ();

        if ($logs)
          $_logs = $logs;

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

    this.userBuyStep = function (autoBuy) {
      if (_markerInfos[this.index].owner && _markerInfos[this.index].owner != this)
        return false;

      if (!(autoBuy || confirm ((_markerInfos[this.index].layer ? '是否加蓋' : '是否購買') + _markerInfos[this.index].title + '(' + _markerInfos[this.index].price + '元)？'))) {
        _markerInfos[this.index].owner = null;
        logs (this.name + ' 取消' + (_markerInfos[this.index].layer ? '加蓋' : '購買') + _markerInfos[this.index].title + '！');
        return false;
      }

      if (this.quotaObj.text () < _markerInfos[this.index].price) {
        logs (this.name + ' 錢不夠，哭哭..');
        return true;
      }

      if (!_markerInfos[this.index].toBuild (this)) {
        alert ('系統錯誤！');
        location.reload ();
      }

      _markerInfos[this.index].owner = this;
      this.quotaObj.text (this.quotaObj.text () - _markerInfos[this.index].price);

      if (_markerInfos[this.index].layer > 1)
        logs (this.name + ' 房子加蓋了一層！');
      else
        logs (this.name + ' 蓋了一棟房子！');

      return true;
    };

    this.userPayStep = function (autoBuy) {
      if (!_markerInfos[this.index].owner || _markerInfos[this.index].owner == this)
        return false;

      var price = parseInt (_markerInfos[this.index].layer * _markerInfos[this.index].price, 10);

      if (this.quotaObj.text () < price) {
        alert (this.name + ' 破產了！');
        location.reload ();
      } else {
        this.quotaObj.text (this.quotaObj.text () - price);
        _markerInfos[this.index].owner.quotaObj.text (parseInt (_markerInfos[this.index].owner.quotaObj.text (), 10) + price);
        logs (this.name + ' 付給了 ' + _markerInfos[this.index].owner.name + ' 過路費 ' + price + '元！');
      }
    };

    this.userGoStop = function (autoRun, callback) {
      this.setPosition ();

      mapGo (this.getPosition (), function (markerInfos) {
        if
          (markerInfos.owner && markerInfos.owner != this) this.payStep ();
        else
          this.buyStep (autoRun ? autoRun : false);

        if (callback)
          callback ();

      }.bind (this, _markerInfos[this.index]));

      return true;
    };

    this.userMove = function (step, unitLat, unitLng, unitCount, unit, autoRun, callback) {
      if (unit <= unitCount) {
        this.index = (this.index + 1) % _markerInfos.length;
        if (step > 1)
          return this.goStep (step - 1, autoRun, callback);
        else
          return this.goStop (autoRun, callback);

        return true;
      } else {
        this.setPosition (new google.maps.LatLng (this.getPosition ().lat () + unitLat, this.getPosition ().lng () + unitLng));

        setTimeout (function () {
          this.move (step, unitLat, unitLng, unitCount + 1, unit, autoRun, callback);
        }.bind (this), 50);
      }
    };
    this.userGoStep = function (step, autoRun, callback) {
      if (step < 1)
        return false;

      var now = this.getPosition ();
      var will = _markerInfos[(this.index + 1) % _markerInfos.length].getPosition ();

      var Unit = getUnit (will, now);
      if (!Unit)
        return false;

      _markerInfos[this.index].userCount -= 1;
      this.move (step, Unit.lat, Unit.lng, 0, Unit.unit, autoRun, callback);
    };

    this.createUser = function (name, $quota, color) {
      return {
        id: _userCount++,
        index: 0,
        name: name,
        quotaObj: $quota,
        move: this.userMove,
        goStep: this.userGoStep,
        goStop: this.userGoStop,
        buyStep: this.userBuyStep,
        payStep: this.userPayStep,
        setPosition: this.setUserPosition,
        getPosition: function () { return this.marker ? this.marker.getPosition () : null; },
        marker: new google.maps.Marker ({
            map: _map,
            draggable: false,
            icon: {
              path: userPath (),
              strokeColor: color,
              strokeWeight: 1,
              fillColor: color,
              fillOpacity: 0.5
            }
          })};
    };
  }

  window.funcs = funcs;
})();