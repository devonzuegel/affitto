(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ANIMATION_RATE, Maps, MyModel, PRICE_RANGE, STDEV, Shapes, TURTLE_POP, TURTLE_SIZE, TURTLE_SPEED, TURTLE_VAR, TURTLE_WIGGLE, log, model, u,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

u = ABM.Util;

Shapes = ABM.Shapes;

Maps = ABM.ColorMaps;

log = function(arg) {
  return console.log(arg);
};

TURTLE_POP = 3;

TURTLE_SIZE = 0.3;

TURTLE_SPEED = 0;

TURTLE_VAR = 3;

TURTLE_WIGGLE = 100;

PRICE_RANGE = [0, 255];

STDEV = 40;

ANIMATION_RATE = 3;

MyModel = (function(superClass) {
  extend(MyModel, superClass);

  function MyModel() {
    return MyModel.__super__.constructor.apply(this, arguments);
  }

  MyModel.prototype.gaussian_approx = function(_min, _max) {
    var i, j, n_iterations, ref, result;
    if (_min == null) {
      _min = 0;
    }
    if (_max == null) {
      _max = 1;
    }
    result = 0;
    n_iterations = 3;
    for (i = j = 0, ref = n_iterations; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      result += this.random_num(_max, _min);
    }
    return result / (1.0 * n_iterations);
  };

  MyModel.prototype.new_price = function(p) {
    return Math.floor(this.gaussian_approx(p.desirability - STDEV, p.desirability + STDEV));
  };

  MyModel.prototype.new_desirability = function() {
    return Math.floor(this.gaussian_approx(this.price_range[0] + STDEV, this.price_range[1] - STDEV));
  };

  MyModel.prototype.patch_utility = function(p) {
    return p.desirability - p.price + this.random_num(-TURTLE_VAR, TURTLE_VAR);
  };

  MyModel.prototype.random_num = function(_max, _min) {
    if (_min == null) {
      _min = 0;
    }
    return Math.floor(Math.random() * (_max - _min) + _min);
  };

  MyModel.prototype.happiness_color = function(t) {
    return ABM.Color.rgbaString(t.happiness, t.happiness, t.happiness);
  };

  MyModel.prototype.price_color = function(p) {
    return Maps.randomGray(p.price, p.price);
  };

  MyModel.prototype.initialize_patch = function(p) {
    p.desirability = this.new_desirability();
    p.price = this.new_price(p);
    return p.color = this.price_color(p);
  };

  MyModel.prototype.initialize_turtle = function(t) {
    var random_i;
    t.shape = 'person';
    t.happiness = this.patch_utility(t.p);
    t.color = this.happiness_color(t);
    t.penDown = true;
    random_i = this.random_num(this.patches.length - 1);
    return t.moveTo(this.patches[random_i]);
  };

  MyModel.prototype.setup = function() {
    var j, k, len, len1, p, ref, ref1, results, t;
    this.population = TURTLE_POP;
    this.size = TURTLE_SIZE;
    this.speed = TURTLE_SPEED;
    this.wiggle = u.degToRad(TURTLE_WIGGLE);
    this.price_range = PRICE_RANGE;
    this.turtles.setUseSprites();
    this.turtles.setDefault('size', this.size);
    this.anim.setRate(ANIMATION_RATE, false);
    ref = this.patches;
    for (j = 0, len = ref.length; j < len; j++) {
      p = ref[j];
      this.initialize_patch(p);
    }
    ref1 = this.turtles.create(this.population);
    results = [];
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      t = ref1[k];
      results.push(this.initialize_turtle(t));
    }
    return results;
  };

  MyModel.prototype.step = function() {
    var j, k, len, len1, p, ref, ref1, t;
    ref = this.patches;
    for (j = 0, len = ref.length; j < len; j++) {
      p = ref[j];
      this.updatePatch(p);
    }
    ref1 = this.turtles;
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      t = ref1[k];
      this.updateTurtle(t);
    }
    this.refreshPatches = true;
    if (this.anim.ticks % 100 === 0) {
      this.reportInfo();
      if (this.anim.ticks === 300) {
        this.setSpotlight(this.turtles.oneOf());
      }
    }
    if (this.anim.ticks > 100) {
      log(".. and now we're done! Restart with app.start()");
      return this.stop();
    }
  };

  MyModel.prototype.updateTurtle = function(t) {
    var current_rent, j, len, patch, ref, results;
    current_rent = t.p.price;
    ref = t.p.inRadius(this.patches, 2);
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      patch = ref[j];
      log(t.happiness);
      if (this.patch_utility(patch) > t.happiness) {
        t.moveTo(patch);
        t.happiness = this.patch_utility(patch);
        t.color = this.happiness_color(t);
        break;
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  MyModel.prototype.updatePatch = function(p) {
    var n_turtles;
    n_turtles = p.turtlesHere().length;
    if (n_turtles > 0) {
      return p.price += n_turtles;
    } else {
      return p.price -= 1;
    }
  };

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
  size: 10,
  minX: -30,
  maxX: 30,
  minY: -30,
  maxY: 30,
  isTorus: false,
  hasNeighbors: false
}).debug().start();


},{}]},{},[1]);
