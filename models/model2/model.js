(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ANIMATION_RATE, DEFAULT_PRICE, DIST_COST, IDEAL_POP, LAT_RANGE, LNG_RANGE, MAX_PATCH_POP, MAX_PRICE, Maps, MyModel, NBR_COEFFIC, NBR_RADIUS, NUM_TICKS, OVERPOP_COST, PRICE_VAR, PROB_RENT_CONTROL, STABILITY, Shapes, TURTLE_POP, TURTLE_SIZE, TURTLE_VAR, gui, log, model, u,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

u = ABM.Util;

Shapes = ABM.Shapes;

Maps = ABM.ColorMaps;

log = function(arg) {
  return console.log(arg);
};

TURTLE_SIZE = 0.75;

ANIMATION_RATE = 100;

TURTLE_POP = 1000;

TURTLE_VAR = 100;

PRICE_VAR = 10;

NBR_RADIUS = 2;

NBR_COEFFIC = 1;

OVERPOP_COST = 10000;

DIST_COST = 100;

PROB_RENT_CONTROL = 0;

DEFAULT_PRICE = 188900;

MAX_PRICE = 1000000;

MAX_PATCH_POP = 9;

IDEAL_POP = 3;

STABILITY = 0.9894;

LAT_RANGE = [20, 64];

LNG_RANGE = [-159, -60];

NUM_TICKS = 10000;

MyModel = (function(superClass) {
  extend(MyModel, superClass);

  function MyModel() {
    return MyModel.__super__.constructor.apply(this, arguments);
  }

  MyModel.prototype.set_animation_rate = function(anim_rate) {
    return this.anim.setRate(anim_rate, false);
  };

  MyModel.prototype.set_price_var = function(v) {
    return this.price_var = v;
  };

  MyModel.prototype.set_nbr_radius = function(r) {
    return this.nbr_radius = r;
  };

  MyModel.prototype.set_dist_cost_k = function(c) {
    return this.dist_cost_k = c;
  };

  MyModel.prototype.set_overpop_cost_k = function(c) {
    return this.overpop_cost_k = c;
  };

  MyModel.prototype.set_rent_control_prob = function(prob) {
    var k, len, p, ref, results;
    this.prob_rent_control = prob;
    ref = this.patches;
    results = [];
    for (k = 0, len = ref.length; k < len; k++) {
      p = ref[k];
      results.push(this.initialize_patch(p));
    }
    return results;
  };

  MyModel.prototype.set_overpop_cost_k = function(c) {
    return this.overpop_cost_k = c;
  };

  MyModel.prototype.set_max_price = function(p) {
    return this.max_price = p;
  };

  MyModel.prototype.set_max_patch_pop = function(pop) {
    return this.max_patch_pop = pop;
  };

  MyModel.prototype.set_ideal_pop = function(pop) {
    return this.ideal_pop = pop;
  };

  MyModel.prototype.set_stability = function(s) {
    return this.stability = s;
  };

  MyModel.prototype.coords_key_from_patch = function(patch) {
    return patch.x + "," + patch.y;
  };

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

  MyModel.prototype.distance_cost = function(patch1, patch2) {
    var dist;
    dist = Math.sqrt((patch1.x - patch2.x) ^ 2 + (patch1.y - patch2.y) ^ 2);
    return this.dist_cost_k * Math.log(dist + 1);
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

  MyModel.prototype.patch_utility = function(p, t) {
    return p.desirability - p.price - this.distance_cost(p, t.p) + this.random_num(-TURTLE_VAR, TURTLE_VAR);
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
    p.rent_control = Math.random() < this.prob_rent_control;
    p.desirability = Number.NEGATIVE_INFINITY;
    p.price = Number.POSITIVE_INFINITY;
    return p.color = '#A7D9F6';
  };

  MyModel.prototype.initialize_turtle = function(t) {
    var random_i;
    t.shape = 'person';
    random_i = this.random_num(this.land_patches.length - 1);
    t.moveTo(this.land_patches[random_i]);
    return t.color = this.land_patches[random_i].rent_control ? 'orange' : 'white';
  };

  MyModel.prototype.new_price = function(p) {
    return Math.floor(this.gaussian_approx(p.desirability - this.price_var, p.desirability + this.price_var));
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
    var color, coords, id, k, l, len, len1, len2, m, p, patch, ref, ref1, results, zip;
    this.set_population(TURTLE_POP);
    this.set_animation_rate(ANIMATION_RATE);
    this.set_price_var(PRICE_VAR);
    this.set_nbr_radius(NBR_RADIUS);
    this.set_dist_cost_k(DIST_COST);
    this.set_overpop_cost_k(OVERPOP_COST);
    this.set_rent_control_prob(PROB_RENT_CONTROL);
    this.set_max_price(MAX_PRICE);
    this.set_max_patch_pop(MAX_PATCH_POP);
    this.set_ideal_pop(IDEAL_POP);
    this.set_stability(STABILITY);
    this.turtles.setUseSprites();
    this.turtles.setDefault('size', TURTLE_SIZE);
    ref = this.patches;
    for (k = 0, len = ref.length; k < len; k++) {
      p = ref[k];
      this.initialize_patch(p);
    }
    this.land_patches = [];
    for (l = 0, len1 = zipcodes.length; l < len1; l++) {
      zip = zipcodes[l];
      patch = this.patches.patch(zip[3], zip[2]);
      patch.sizerank = zip[0];
      patch.price = zip[1];
      color = Math.max(0, Math.min(150, Math.ceil(150 * p.price / 1000000.0)));
      p.color = Maps.randomGray(color, color);
      patch.desirability = 0;
      this.land_patches.push(patch);
    }
    this.land_patches = this.unique_array(this.land_patches);
    this.turtles.create(this.population, (function(_this) {
      return function(t) {
        return _this.initialize_turtle(t);
      };
    })(this));
    this.edges = [];
    this.nodes = {};
    this.node_ids = {};
    id = 0;
    ref1 = this.land_patches;
    results = [];
    for (m = 0, len2 = ref1.length; m < len2; m++) {
      patch = ref1[m];
      coords = this.coords_key_from_patch(patch);
      this.node_ids[coords] = id;
      results.push(id += 1);
    }
    return results;
  };

  MyModel.prototype.step = function() {
    var coords, id, k, l, len, len1, len2, m, old_this, p, patch, ref, ref1, ref2, t, total_utility;
    if (this.anim.ticks === NUM_TICKS) {
      this.anim.stop();
      id = 0;
      ref = this.land_patches;
      for (k = 0, len = ref.length; k < len; k++) {
        patch = ref[k];
        coords = this.coords_key_from_patch(patch);
        this.nodes[coords] = [id, patch.turtlesHere().length, patch.x, patch.y];
        id += 1;
      }
      log(JSON.stringify(this.nodes));
      log(JSON.stringify(this.edges));
      return;
    }
    ref1 = this.land_patches;
    for (l = 0, len1 = ref1.length; l < len1; l++) {
      p = ref1[l];
      this.updatePatch(p);
    }
    ref2 = this.turtles;
    for (m = 0, len2 = ref2.length; m < len2; m++) {
      t = ref2[m];
      this.updateTurtle(t);
    }
    this.refreshPatches = true;
    old_this = this;
    total_utility = (this.turtles.map(function(t) {
      return old_this.patch_utility(t.p, t);
    })).reduce(function(a, b) {
      return a + b;
    });
    return $('#total-utility').text("Total utility = " + total_utility);
  };

  MyModel.prototype.updateTurtle = function(t) {
    var best_so_far, best_so_far_utility, k, len, n_turtles, new_patch_id, old_patch_id, original_utility, patch, ref;
    if (Math.random() < this.stability) {
      return;
    }
    best_so_far = t.p;
    best_so_far_utility = this.patch_utility(best_so_far, t);
    original_utility = this.patch_utility(t.p, t);
    ref = this.shuffle_array(this.land_patches);
    for (k = 0, len = ref.length; k < len; k++) {
      patch = ref[k];
      n_turtles = patch.turtlesHere().length;
      if (n_turtles > this.max_patch_pop) {
        continue;
      }
      if (this.patch_utility(patch, t) > best_so_far_utility) {
        best_so_far = patch;
        best_so_far_utility = this.patch_utility(best_so_far, t);
      }
    }
    t.color = best_so_far.rent_control ? 'orange' : 'white';
    if (best_so_far !== t.p) {
      old_patch_id = this.node_ids[this.coords_key_from_patch(t.p)];
      new_patch_id = this.node_ids[this.coords_key_from_patch(best_so_far)];
      this.edges.push([old_patch_id, new_patch_id]);
      return t.moveTo(best_so_far);
    }
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
    var color, n_turtles, nbr_patches, random_nbr_patch;
    n_turtles = p.turtlesHere().length;
    p.desirability = -this.overpop_cost_k * Math.abs(this.ideal_pop - n_turtles);
    nbr_patches = this.patches.inRadius(p, this.nbr_radius);
    random_nbr_patch = nbr_patches[this.random_num(nbr_patches.length - 1)];
    p.desirability += random_nbr_patch.turtlesHere().length * NBR_COEFFIC;
    if (p.price === Infinity) {
      p.price = DEFAULT_PRICE;
    }
    p.price = Math.max(0, p.price - this.overpop_cost_k * (this.ideal_pop - n_turtles + this.gaussian_approx(-this.price_var, this.price_var)));
    if (p.rent_control) {
      p.price = Math.min(this.max_price, p.price);
    }
    color = Math.max(0, Math.min(150, Math.ceil(150 * p.price / 1000000.0)));
    return p.color = Maps.randomGray(color, color);
  };

  return MyModel;

})(ABM.Model);

model = new MyModel({
  div: 'layers',
  size: 15,
  minX: LNG_RANGE[0],
  maxX: LNG_RANGE[1],
  minY: LAT_RANGE[0],
  maxY: LAT_RANGE[1],
  isTorus: false,
  hasNeighbors: false
}).debug().start();

gui = new ABM.DatGUI(model, {
  'Population': {
    type: 'slider',
    min: 0,
    max: 1000,
    step: 1,
    val: TURTLE_POP,
    smooth: false,
    setter: 'set_population'
  },
  'Animation Rate': {
    type: 'slider',
    min: 1,
    max: 200,
    step: 1,
    val: ANIMATION_RATE,
    smooth: false,
    setter: 'set_animation_rate'
  },
  'Neighbor Radius': {
    type: 'slider',
    min: 1,
    max: 50,
    step: 1,
    val: NBR_RADIUS,
    smooth: false,
    setter: 'set_nbr_radius'
  },
  'Distance Cost Coefficient': {
    type: 'slider',
    min: 1,
    max: 300,
    step: 1,
    val: DIST_COST,
    smooth: false,
    setter: 'set_dist_cost_k'
  },
  'Overpopulation Cost Coefficient': {
    type: 'slider',
    min: 1,
    max: 100 * 1000,
    step: 1,
    val: OVERPOP_COST,
    smooth: false,
    setter: 'set_overpop_cost_k'
  },
  '% of Properties Under Rent Control': {
    type: 'slider',
    min: 0,
    max: 1,
    step: 0.01,
    val: PROB_RENT_CONTROL,
    smooth: true,
    setter: 'set_rent_control_prob'
  },
  'Rent Controlled Price': {
    type: 'slider',
    min: 0,
    max: 1000000,
    step: 0.01,
    val: MAX_PRICE,
    smooth: false,
    setter: 'set_max_price'
  },
  'Max Density': {
    type: 'slider',
    min: 0,
    max: 100,
    step: 1,
    val: MAX_PATCH_POP,
    smooth: false,
    setter: 'set_max_patch_pop'
  },
  'Ideal Population': {
    type: 'slider',
    min: 1,
    max: 100,
    step: 1,
    val: IDEAL_POP,
    smooth: false,
    setter: 'set_ideal_pop'
  },
  'Stability': {
    type: 'slider',
    min: 0,
    max: 1,
    step: 0.00001,
    val: STABILITY,
    smooth: true,
    setter: 'set_stability'
  }
});


},{}]},{},[1]);
