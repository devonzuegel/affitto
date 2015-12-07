(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ANIMATION_RATE, DIST_DISCOUNT, IDEAL_POP, LAT_RANGE, LNG_RANGE, Maps, MyModel, NBR_DISCOUNT, NBR_RADIUS, OVERPOP_COST, PRICE_VAR, STABILITY, Shapes, TURTLE_POP, TURTLE_SIZE, TURTLE_VAR, gui, log, model, u,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

u = ABM.Util;

Shapes = ABM.Shapes;

Maps = ABM.ColorMaps;

log = function(arg) {
  return console.log(arg);
};

TURTLE_SIZE = 0.7;

ANIMATION_RATE = 100;

TURTLE_POP = 200;

TURTLE_VAR = 0;

PRICE_VAR = 40;

STABILITY = .8;

NBR_RADIUS = 40;

NBR_DISCOUNT = 1;

OVERPOP_COST = 1;

DIST_DISCOUNT = 1;

IDEAL_POP = 2;

LAT_RANGE = [20, 64];

LNG_RANGE = [-159, -60];

MyModel = (function(superClass) {
  extend(MyModel, superClass);

  function MyModel() {
    return MyModel.__super__.constructor.apply(this, arguments);
  }

  MyModel.prototype.gaussian_approx = function(_min, _max) {
    var i, k, n_iterations, ref, result;
    if (_min == null) {
      _min = 0;
    }
    if (_max == null) {
      _max = 1;
    }
    result = 0;
    n_iterations = 3;
    for (i = k = 0, ref = n_iterations; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      result += this.random_num(_max, _min);
    }
    return result / (1.0 * n_iterations);
  };

  MyModel.prototype.set_population = function(pop) {
    var change, k, len, ref, t;
    change = pop - this.population;
    if (change < 0) {
      ref = this.turtles.nOf(-change);
      for (k = 0, len = ref.length; k < len; k++) {
        t = ref[k];
        t.die();
      }
    }
    if (change > 0) {
      this.turtles.create(change, (function(_this) {
        return function(t) {
          return _this.initialize_turtle(t);
        };
      })(this));
    }
    return this.population = pop;
  };

  MyModel.prototype.patch_utility = function(p) {
    return p.desirability - p.price + this.random_num(-TURTLE_VAR, TURTLE_VAR);
  };

  MyModel.prototype.shuffle_array = function(array) {
    var i, j, k, ref, temp;
    for (i = k = 0, ref = array.length - 1; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };

  MyModel.prototype.initialize_patch = function(p) {
    p.desirability = Number.NEGATIVE_INFINITY;
    p.price = Number.POSITIVE_INFINITY;
    return p.color = '#A7D9F6';
  };

  MyModel.prototype.initialize_turtle = function(t) {
    var random_i;
    t.shape = 'person';
    t.color = '#555555';
    random_i = this.random_num(this.land_patches.length - 1);
    return t.moveTo(this.land_patches[random_i]);
  };

  MyModel.prototype.new_price = function(p) {
    return Math.floor(this.gaussian_approx(p.desirability - PRICE_VAR, p.desirability + PRICE_VAR));
  };

  MyModel.prototype.random_num = function(_max, _min) {
    if (_min == null) {
      _min = 0;
    }
    return Math.floor(Math.random() * (_max - _min) + _min);
  };

  MyModel.prototype.unique_array = function(a) {
    return a.filter(function(item, pos) {
      return a.indexOf(item) === pos;
    });
  };

  MyModel.prototype.setup = function() {
    var k, l, len, len1, p, patch, ref, zip;
    this.set_population(TURTLE_POP);
    this.size = TURTLE_SIZE;
    this.turtles.setUseSprites();
    this.turtles.setDefault('size', this.size);
    this.anim.setRate(ANIMATION_RATE, false);
    ref = this.patches;
    for (k = 0, len = ref.length; k < len; k++) {
      p = ref[k];
      this.initialize_patch(p);
    }
    this.land_patches = [];
    for (l = 0, len1 = zipcodes.length; l < len1; l++) {
      zip = zipcodes[l];
      patch = this.patches.patch(zip[3], zip[2]);
      this.land_patches.push(patch);
      patch.color = 'white';
      patch.sizerank = zip[0];
      patch.price = zip[1];
      patch.desirability = this.gaussian_approx(p.price - PRICE_VAR, p.price + PRICE_VAR);
    }
    this.land_patches = this.unique_array(this.land_patches);
    return this.turtles.create(this.population, (function(_this) {
      return function(t) {
        return _this.initialize_turtle(t);
      };
    })(this));
  };

  MyModel.prototype.step = function() {
    var k, l, len, len1, p, ref, ref1, t;
    ref = this.land_patches;
    for (k = 0, len = ref.length; k < len; k++) {
      p = ref[k];
      this.updatePatch(p);
    }
    ref1 = this.turtles;
    for (l = 0, len1 = ref1.length; l < len1; l++) {
      t = ref1[l];
      this.updateTurtle(t);
    }
    return this.refreshPatches = true;
  };

  MyModel.prototype.updateTurtle = function(t) {
    var best_so_far, k, len, patch, ref;
    if (Math.random() < STABILITY) {
      return;
    }
    best_so_far = t.p;
    ref = this.shuffle_array(this.land_patches);
    for (k = 0, len = ref.length; k < len; k++) {
      patch = ref[k];
      if (this.patch_utility(patch) > this.patch_utility(best_so_far)) {
        best_so_far = patch;
      }
    }
    return t.moveTo(best_so_far);
  };

  MyModel.prototype.updatePatch = function(p) {

    /* TODO: things to incoprorate:
    - desirability could depend on being near friends / overcrowding
      + incorporate population of this patch and also of neighboring patches
    - how long a patch has been left empty >> price lowers a lot
    - turtle less likely to move if he moved recently
    - turtles prefer to not move long distances if possible (cost to distance from
      current patch to next patch)
     */
    var n_turtles, nbr_patches, random_nbr_patch;
    n_turtles = p.turtlesHere().length;
    p.desirability = n_turtles > IDEAL_POP ? -OVERPOP_COST * n_turtles : n_turtles;
    nbr_patches = this.patches.inRadius(p, NBR_RADIUS);
    random_nbr_patch = nbr_patches[this.random_num(nbr_patches.length - 1)];
    p.desirability += random_nbr_patch.turtlesHere().length / (NBR_DISCOUNT * 1.0);
    return p.price = p.price + 10 * (1 - Math.sqrt(n_turtles));
  };

  return MyModel;

})(ABM.Model);

model = new MyModel({
  div: 'layers',
  size: 14,
  minX: LNG_RANGE[0],
  maxX: LNG_RANGE[1],
  minY: LAT_RANGE[0],
  maxY: LAT_RANGE[1],
  isTorus: false,
  hasNeighbors: false
}).debug().start();

gui = new ABM.DatGUI(model, {
  'population': {
    type: 'slider',
    min: 0,
    max: 1000,
    step: 1,
    val: TURTLE_POP,
    smooth: false,
    setter: 'set_population'
  }
});


},{}]},{},[1]);
