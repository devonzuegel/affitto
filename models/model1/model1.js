// Generated by CoffeeScript 1.10.0
(function() {
  var Maps, MyModel, Shapes, log, model, u,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  u = ABM.Util;

  Shapes = ABM.Shapes;

  Maps = ABM.ColorMaps;

  log = function(arg) {
    return console.log(arg);
  };

  MyModel = (function(superClass) {
    extend(MyModel, superClass);

    function MyModel() {
      return MyModel.__super__.constructor.apply(this, arguments);
    }

    MyModel.prototype.gaussian_approx = function(_min, _max) {
      var curve, diff, middle, result;
      if (_min == null) {
        _min = 0;
      }
      if (_max == null) {
        _max = 1;
      }
      result = -1;
      while (result < 0) {
        curve = ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 4) / 4;
        diff = _max - _min;
        middle = _max - diff / 2.0;
        result = middle + diff * curve;
      }
      return result;
    };

    MyModel.prototype.setup = function() {
      var a, color, i, j, len, len1, p, ref, ref1, results;
      this.population = 3;
      this.size = 0.9;
      this.speed = 100;
      this.wiggle = u.degToRad(100);
      this.initial_price_range = [0, 100];
      this.turtles.setUseSprites();
      this.turtles.setDefault('size', this.size);
      this.anim.setRate(30, false);
      ref = this.patches;
      for (i = 0, len = ref.length; i < len; i++) {
        p = ref[i];
        p.price = this.gaussian_approx(this.initial_price_range[0], this.initial_price_range[1]);
        color = Math.floor(p.price);
        p.color = Maps.randomGray(color, color);
      }
      ref1 = this.turtles.create(this.population);
      results = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        a = ref1[j];
        results.push(a.shape = 'person');
      }
      return results;
    };

    MyModel.prototype.step = function() {
      var a, i, j, len, len1, p, ref, ref1;
      ref = this.turtles;
      for (i = 0, len = ref.length; i < len; i++) {
        a = ref[i];
        this.updateTurtles(a);
      }
      if (this.anim.ticks % 100 === 0) {
        ref1 = this.patches;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          p = ref1[j];
          this.updatePrices(p);
        }
        this.reportInfo();
        this.refreshPatches = true;
        if (this.anim.ticks === 300) {
          return this.setSpotlight(this.turtles.oneOf());
        }
      } else {
        return this.refreshPatches = false;
      }
    };

    MyModel.prototype.updateTurtles = function(t) {
      t.rotate(u.randomCentered(this.wiggle));
      t.forward(this.speed);
      return this.speed /= 1.01;
    };

    MyModel.prototype.updatePrices = function(p) {};

    MyModel.prototype.reportInfo = function() {
      var avgHeading, headings;
      headings = this.turtles.getProp("heading");
      avgHeading = (headings.reduce(function(a, b) {
        return a + b;
      })) / this.turtles.length;
      return log("average heading of turtles: " + (avgHeading.toFixed(2)) + " radians, " + (u.radToDeg(avgHeading).toFixed(2)) + " degrees");
    };

    return MyModel;

  })(ABM.Model);

  model = new MyModel({
    div: "layers",
    size: 20,
    minX: -16,
    maxX: 16,
    minY: -16,
    maxY: 16,
    isTorus: true,
    hasNeighbors: false
  }).debug().start();

}).call(this);
