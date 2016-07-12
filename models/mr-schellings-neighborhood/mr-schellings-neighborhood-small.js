(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Neighborhood, model, modelOpts,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Neighborhood = (function(superClass) {
  extend(Neighborhood, superClass);

  function Neighborhood() {
    return Neighborhood.__super__.constructor.apply(this, arguments);
  }

  Neighborhood.prototype.startup = function() {
    this.colors = [
      {
        color: [255, 255, 255],
        label: 'white'
      }, {
        color: [110, 220, 255],
        label: 'blue'
      }, {
        color: [235, 140, 140],
        label: 'red'
      }
    ];
    this.percent_open = 1;
    this.threshold = 2;
    this.open_patches = [];
    return console.log('Setup complete!');
  };

  Neighborhood.prototype.setup = function() {
    var j, len, p, ref, results;
    ref = this.patches;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      p = ref[j];
      if (Math.random() < this.percent_open * 0.01) {
        results.push(this.set_blank(p));
      } else if (Math.random() < 0.5) {
        results.push(this.set_team(p, 1));
      } else {
        results.push(this.set_team(p, 2));
      }
    }
    return results;
  };

  Neighborhood.prototype.step = function() {
    if (this.anim.ticks % 2 === 1) {
      return this.count_neighbors();
    } else {
      return this.enact_movement();
    }
  };

  Neighborhood.prototype.count_neighbors = function() {
    var j, len, p, patch, ref, results;
    this.open_patches = [];
    ref = this.patches;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      p = ref[j];
      if (this.linkEnabled) {
        patch = this.linkedModel.patches.patch(p.x, p.y);
      } else {
        patch = p;
      }
      if (p.team === 0) {
        results.push(this.open_patches.push(p));
      } else {
        results.push(p.friendly_neighbors = patch.n["with"](function(p) {
          return p.team === patch.team;
        }).length);
      }
    }
    return results;
  };

  Neighborhood.prototype.enact_movement = function() {
    var j, len, p, ref, results;
    ref = this.patches;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      p = ref[j];
      if (p.friendly_neighbors <= this.threshold) {
        results.push(this.move(p));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  Neighborhood.prototype.set_team = function(p, team) {
    p.team = team;
    p.color = this.colors[team].color;
    return p.label = this.colors[team].label;
  };

  Neighborhood.prototype.move = function(old_patch) {
    var i;
    if (this.open_patches.length > 0) {
      i = this._randomNum(this.open_patches.length);
      this.set_team(this.open_patches[i], old_patch.team);
      this.open_patches.splice(i, 1);
      return this.set_blank(old_patch);
    }
  };

  Neighborhood.prototype.set_blank = function(p) {
    this.set_team(p, 0);
    return this.open_patches.push(p);
  };

  Neighborhood.prototype.reset_model = function() {
    this.reset();
    return this.start();
  };

  Neighborhood.prototype.toggleLink = function() {
    return this.linkEnabled = this.linkedModel.linkEnabled = !this.linkEnabled;
  };

  Neighborhood.prototype.log = function(p) {
    return console.log("(" + p.x + ", " + p.y + ") " + p.label + " " + p.friendly_neighbors);
  };

  Neighborhood.prototype._randomNum = function(max, min) {
    if (min == null) {
      min = 0;
    }
    return Math.floor(Math.random() * (max - min) + min);
  };

  Neighborhood.prototype.set_threshold = function(threshold) {
    this.threshold = threshold;
    return this.reset_model();
  };

  Neighborhood.prototype.set_open = function(percent_open) {
    this.percent_open = percent_open;
    return this.reset_model();
  };

  return Neighborhood;

})(ABM.Model);

modelOpts = {
  size: 5,
  minX: 0,
  maxX: 150,
  minY: 0,
  maxY: 45,
  div: 'model'
};

model = window.model = new Neighborhood(modelOpts);

model.on('step', function() {
  if (model.anim.ticks % 100 === 0) {
    return console.log("model:", model.anim.toString());
  }
});

model.on('draw', function() {
  if (model.anim.draws % 100 === 0) {
    return console.log("model:", model.anim.toString());
  }
});

window.gui1 = new ABM.DatGUI(model, {
  "RESET MODEL": {
    type: "button",
    setter: "reset_model"
  },
  "Threshold": {
    type: "slider",
    min: 0,
    max: 7,
    step: 1,
    val: model.threshold,
    smooth: false,
    setter: "set_threshold"
  },
  "Percent open": {
    type: "slider",
    min: 0.1,
    max: 100,
    step: 0.2,
    val: model.percent_open,
    smooth: true,
    setter: "set_open"
  }
});

model.start();


},{}]},{},[1]);
