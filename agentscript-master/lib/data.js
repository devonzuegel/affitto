(function() {
  var AscDataSet, DataSet, ImageDataSet, PatchDataSet, u,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  u = ABM.Util;

  ABM.DataSet = DataSet = (function() {
    DataSet.patchDataSet = function(f) {
      return new PatchDataSet(f);
    };

    DataSet.importImageDataSet = function(name, f, format, arrayType, rowsPerSlice) {
      var ds;
      if (format == null) {
        format = u.pixelByte(0);
      }
      if (arrayType == null) {
        arrayType = Uint8ClampedArray;
      }
      ds = new ImageDataSet(null, format, arrayType, rowsPerSlice);
      u.importImage(name, function(img) {
        ds.parse(img);
        if (f != null) {
          return f(ds);
        }
      });
      return ds;
    };

    DataSet.importAscDataSet = function(name, f) {
      var ds;
      ds = new AscDataSet();
      u.xhrLoadFile(name, "GET", "text", function(response) {
        ds.parse(response);
        if (f != null) {
          return f(ds);
        }
      });
      return ds;
    };

    function DataSet(width, height, data, model1) {
      if (width == null) {
        width = 0;
      }
      if (height == null) {
        height = 0;
      }
      if (data == null) {
        data = [];
      }
      this.model = model1;
      this.setDefaults();
      this.reset(width, height, data);
    }

    DataSet.prototype.reset = function(width1, height1, data1) {
      this.width = width1;
      this.height = height1;
      this.data = data1;
      if (this.data.length !== this.width * this.height) {
        u.error("DataSet: data array length error:\ndata.length: " + this.data.length + " width: " + this.width + " height: " + this.height);
      }
      return this;
    };

    DataSet.prototype.checkXY = function(x, y) {
      if (!((0 <= x && x <= this.width - 1) && (0 <= y && y <= this.height - 1))) {
        return u.error("x,y out of range: " + x + "," + y);
      }
    };

    DataSet.prototype.setDefaults = function() {
      this.useNearest = false;
      this.crop = false;
      this.normalizeImage = true;
      this.alpha = 255;
      return this.gray = true;
    };

    DataSet.prototype.setSampler = function(useNearest) {
      this.useNearest = useNearest;
    };

    DataSet.prototype.setConvolveCrop = function(crop) {
      this.crop = crop;
    };

    DataSet.prototype.setImageNormalize = function(normalizeImage) {
      this.normalizeImage = normalizeImage;
    };

    DataSet.prototype.setImageAlpha = function(alpha) {
      this.alpha = alpha;
    };

    DataSet.prototype.setImageGray = function(gray) {
      this.gray = gray;
    };

    DataSet.prototype.setModel = function(model1) {
      this.model = model1;
    };

    DataSet.prototype.sample = function(x, y) {
      if (this.useNearest) {
        return this.nearest(x, y);
      } else {
        return this.bilinear(x, y);
      }
    };

    DataSet.prototype.nearest = function(x, y) {
      return this.getXY(Math.round(x), Math.round(y));
    };

    DataSet.prototype.bilinear = function(x, y) {
      var dx, dy, f00, f01, f10, f11, i, ref, ref1, ref2, w, x0, y0;
      this.checkXY(x, y);
      x0 = Math.floor(x);
      y0 = Math.floor(y);
      i = this.toIndex(x0, y0);
      w = this.width;
      x = x - x0;
      y = y - y0;
      dx = 1 - x;
      dy = 1 - y;
      f00 = this.data[i];
      f01 = (ref = this.data[i + w]) != null ? ref : 0;
      f10 = (ref1 = this.data[++i]) != null ? ref1 : 0;
      f11 = (ref2 = this.data[i + w]) != null ? ref2 : 0;
      return f00 * dx * dy + f10 * x * dy + f01 * dx * y + f11 * x * y;
    };

    DataSet.prototype.toIndex = function(x, y) {
      return x + y * this.width;
    };

    DataSet.prototype.toXY = function(i) {
      return [i % this.width, Math.floor(i / this.width)];
    };

    DataSet.prototype.getXY = function(x, y) {
      this.checkXY(x, y);
      return this.data[this.toIndex(x, y)];
    };

    DataSet.prototype.setXY = function(x, y, num) {
      this.checkXY(x, y);
      return this.data[this.toIndex(x, y)] = num;
    };

    DataSet.prototype.toString = function(p, sep) {
      var data, i, k, ref, s;
      if (p == null) {
        p = 2;
      }
      if (sep == null) {
        sep = ", ";
      }
      s = "width: " + this.width + " height: " + this.height + " data:";
      data = p < 0 ? this.data : u.aToFixed(this.data, p);
      for (i = k = 0, ref = this.height; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
        s += "\n" + (i + ": " + (data.slice(i * this.width, (i + 1) * this.width)));
      }
      return s.replace(/,/g, sep);
    };

    DataSet.prototype.toImage = function() {
      return this.toContext().canvas;
    };

    DataSet.prototype.toContext = function() {
      var ctx, d, data, i, idata, j, k, len, num, ta;
      ctx = u.createCtx(this.width, this.height);
      idata = ctx.getImageData(0, 0, this.width, this.height);
      ta = idata.data;
      if (this.normalizeImage) {
        data = this.gray ? u.normalize8(this.data) : u.normalizeInt(this.data, 0, Math.pow(2, 24) - 1);
      } else {
        data = (function() {
          var k, len, ref, results;
          ref = this.data;
          results = [];
          for (k = 0, len = ref.length; k < len; k++) {
            d = ref[k];
            results.push(Math.round(d));
          }
          return results;
        }).call(this);
      }
      for (i = k = 0, len = data.length; k < len; i = ++k) {
        num = data[i];
        j = 4 * i;
        if (this.gray) {
          ta[j] = ta[j + 1] = ta[j + 2] = Math.floor(num);
          ta[j + 3] = this.alpha;
        } else {
          ta[j] = (num >> 16) & 0xff;
          ta[j + 1] = (num >> 8) & 0xff;
          ta[j + 2] = num & 0xff;
          ta[j + 3] = this.normalizeImage ? this.alpha : ta[j + 3] = (num >> 24) & 0xff;
        }
      }
      ctx.putImageData(idata, 0, 0);
      return ctx;
    };

    DataSet.prototype.toDataUrl = function() {
      return u.ctxToDataUrl(this.toContext());
    };

    DataSet.prototype.toDrawing = function(model) {
      var img;
      if (model == null) {
        model = this.model;
      }
      model.patches.installDrawing(img = this.toImage());
      return img;
    };

    DataSet.prototype.toPatchColors = function(model) {
      var img;
      if (model == null) {
        model = this.model;
      }
      model.patches.installColors(img = this.toImage());
      return img;
    };

    DataSet.prototype.toPatchVar = function(name, model) {
      var i, k, l, len, len1, p, ps;
      if (model == null) {
        model = this.model;
      }
      if ((ps = model.patches).length === this.data.length) {
        for (i = k = 0, len = ps.length; k < len; i = ++k) {
          p = ps[i];
          p[name] = this.data[i];
        }
      } else {
        for (l = 0, len1 = ps.length; l < len1; l++) {
          p = ps[l];
          p[name] = this.patchSample(p.x, p.y, model);
        }
      }
      return null;
    };

    DataSet.prototype.coordSample = function(x, y, tlx, tly, w, h) {
      var xs, ys;
      xs = (x - tlx) * (this.width - 1) / w;
      ys = (tly - y) * (this.height - 1) / h;
      return this.sample(xs, ys);
    };

    DataSet.prototype.patchSample = function(px, py, model) {
      var w;
      if (model == null) {
        model = this.model;
      }
      w = model.world;
      return this.coordSample(px, py, w.minXcor, w.maxYcor, w.numX, w.numY);
    };

    DataSet.prototype.normalize = function(lo, hi) {
      return new DataSet(this.width, this.height, u.normalize(this.data, lo, hi), this.model);
    };

    DataSet.prototype.normalize8 = function() {
      return new DataSet(this.width, this.height, u.normalize8(this.data), this.model);
    };

    DataSet.prototype.resample = function(width, height) {
      var data, k, l, ref, ref1, x, xScale, xs, y, yScale, ys;
      if (width === this.width && height === this.height) {
        return new DataSet(width, height, this.data, this.model);
      }
      data = [];
      xScale = (this.width - 1) / (width - 1);
      yScale = (this.height - 1) / (height - 1);
      for (y = k = 0, ref = height; k < ref; y = k += 1) {
        for (x = l = 0, ref1 = width; l < ref1; x = l += 1) {
          xs = x * xScale;
          ys = y * yScale;
          data.push(this.sample(xs, ys));
        }
      }
      return new DataSet(width, height, data, this.model);
    };

    DataSet.prototype.neighborhood = function(x, y, array) {
      var dx, dy, k, l, x0, y0;
      if (array == null) {
        array = [];
      }
      array.length = 0;
      for (dy = k = -1; k <= 1; dy = ++k) {
        for (dx = l = -1; l <= 1; dx = ++l) {
          x0 = u.clamp(x + dx, 0, this.width - 1);
          y0 = u.clamp(y + dy, 0, this.height - 1);
          array.push(this.data[this.toIndex(x0, y0)]);
        }
      }
      return array;
    };

    DataSet.prototype.convolve = function(kernel, factor) {
      var array, h, k, l, n, ref, ref1, ref2, ref3, w, x, x0, y, y0;
      if (factor == null) {
        factor = 1;
      }
      array = [];
      n = [];
      if (this.crop) {
        x0 = y0 = 1;
        h = this.height - 1;
        w = this.width - 1;
      } else {
        x0 = y0 = 0;
        h = this.height;
        w = this.width;
      }
      for (y = k = ref = y0, ref1 = h; k < ref1; y = k += 1) {
        for (x = l = ref2 = x0, ref3 = w; l < ref3; x = l += 1) {
          this.neighborhood(x, y, n);
          array.push(u.aSum(u.aPairMul(kernel, n)) * factor);
        }
      }
      return new DataSet(w - x0, h - y0, array, this.model);
    };

    DataSet.prototype.dzdx = function(n, factor) {
      if (n == null) {
        n = 2;
      }
      if (factor == null) {
        factor = 1 / 8;
      }
      return this.convolve([-1, 0, 1, -n, 0, n, -1, 0, 1], factor);
    };

    DataSet.prototype.dzdy = function(n, factor) {
      if (n == null) {
        n = 2;
      }
      if (factor == null) {
        factor = 1 / 8;
      }
      return this.convolve([1, n, 1, 0, 0, 0, -1, -n, -1], factor);
    };

    DataSet.prototype.laplace8 = function() {
      return this.convolve([-1, -1, -1, -1, 8, -1, -1, -1, -1]);
    };

    DataSet.prototype.laplace4 = function() {
      return this.convolve([0, -1, 0, -1, 4, -1, 0, -1, 0]);
    };

    DataSet.prototype.blur = function(factor) {
      if (factor == null) {
        factor = 0.0625;
      }
      return this.convolve([1, 2, 1, 2, 4, 2, 1, 2, 1], factor);
    };

    DataSet.prototype.edge = function() {
      return this.convolve([1, 1, 1, 1, -7, 1, 1, 1, 1]);
    };

    DataSet.prototype.filter = function(f) {
      var d;
      return new DataSet(this.width, this.height, (function() {
        var k, len, ref, results;
        ref = this.data;
        results = [];
        for (k = 0, len = ref.length; k < len; k++) {
          d = ref[k];
          results.push(f(d));
        }
        return results;
      }).call(this), this.model);
    };

    DataSet.prototype.slopeAndAspect = function(noNaNs, posAngle) {
      var aspect, dzdx, dzdy, gx, gy, h, k, l, rad, ref, ref1, slope, w, x, y;
      if (noNaNs == null) {
        noNaNs = true;
      }
      if (posAngle == null) {
        posAngle = true;
      }
      dzdx = this.dzdx();
      dzdy = this.dzdy();
      aspect = [];
      slope = [];
      h = dzdx.height;
      w = dzdx.width;
      for (y = k = 0, ref = h; k < ref; y = k += 1) {
        for (x = l = 0, ref1 = w; l < ref1; x = l += 1) {
          gx = dzdx.getXY(x, y);
          gy = dzdy.getXY(x, y);
          slope.push(Math.atan(Math.sqrt(gx * gx + gy * gy)));
          while (noNaNs && gx === gy) {
            gx += u.randomNormal(0, .0001);
            gy += u.randomNormal(0, .0001);
          }
          rad = (gx === gy && gy === 0) ? NaN : Math.atan2(-gy, -gx);
          if (posAngle && rad < 0) {
            rad += 2 * Math.PI;
          }
          aspect.push(rad);
        }
      }
      slope = new DataSet(w, h, slope, this.model);
      aspect = new DataSet(w, h, aspect, this.model);
      return u.aToObj([slope, aspect, dzdx, dzdy], ["slope", "aspect", "dzdx", "dzdy"]);
    };

    DataSet.prototype.subset = function(x, y, width, height) {
      var data, i, j, k, l, ref, ref1, ref2, ref3;
      if (x + width > this.width || y + height > this.height) {
        u.error("subSet: params out of range");
      }
      data = [];
      for (j = k = ref = y, ref1 = y + height; k < ref1; j = k += 1) {
        for (i = l = ref2 = x, ref3 = x + width; l < ref3; i = l += 1) {
          data.push(this.getXY(i, j));
        }
      }
      return new DataSet(width, height, data, this.model);
    };

    return DataSet;

  })();

  ABM.AscDataSet = AscDataSet = (function(superClass) {
    extend(AscDataSet, superClass);

    function AscDataSet(str, model1) {
      this.str = str != null ? str : "";
      this.model = model1;
      AscDataSet.__super__.constructor.call(this);
      if (this.str.length === 0) {
        return;
      }
      this.parse(this.str);
    }

    AscDataSet.prototype.parse = function(str) {
      var i, k, keyVal, l, m, nums, ref, ref1, textData;
      this.str = str;
      textData = this.str.split("\n");
      this.header = {};
      for (i = k = 0; k <= 5; i = ++k) {
        keyVal = textData[i].split(/\s+/);
        this.header[keyVal[0].toLowerCase()] = parseFloat(keyVal[1]);
      }
      for (i = l = 0, ref = this.header.nrows; l < ref; i = l += 1) {
        nums = textData[6 + i].trim().split(" ");
        for (i = m = 0, ref1 = nums.length; 0 <= ref1 ? m < ref1 : m > ref1; i = 0 <= ref1 ? ++m : --m) {
          nums[i] = parseFloat(nums[i]);
        }
        this.data = this.data.concat(nums);
      }
      return this.reset(this.header.ncols, this.header.nrows, this.data);
    };

    return AscDataSet;

  })(DataSet);

  ABM.ImageDataSet = ImageDataSet = (function(superClass) {
    extend(ImageDataSet, superClass);

    function ImageDataSet(img, f1, arrayType1, rowsPerSlice1, model1) {
      this.f = f1 != null ? f1 : u.pixelByte(0);
      this.arrayType = arrayType1 != null ? arrayType1 : Uint8ClampedArray;
      this.rowsPerSlice = rowsPerSlice1;
      this.model = model1;
      ImageDataSet.__super__.constructor.call(this);
      if (img == null) {
        return;
      }
      this.parse(img);
    }

    ImageDataSet.prototype.parse = function(img) {
      var data;
      this.rowsPerSlice || (this.rowsPerSlice = img.height);
      data = u.imageRowsToData(img, this.rowsPerSlice, this.f, this.arrayType);
      return this.reset(img.width, img.height, data);
    };

    return ImageDataSet;

  })(DataSet);

  ABM.PatchDataSet = PatchDataSet = (function(superClass) {
    extend(PatchDataSet, superClass);

    function PatchDataSet(f, arrayType, model1) {
      var data, i, k, len, p, ps;
      if (arrayType == null) {
        arrayType = Array;
      }
      this.model = model1;
      data = new arrayType((ps = this.model.patches).length);
      if (u.isString(f)) {
        f = u.propFcn(f);
      }
      for (i = k = 0, len = ps.length; k < len; i = ++k) {
        p = ps[i];
        data[i] = f(p);
      }
      PatchDataSet.__super__.constructor.call(this, ps.numX, ps.numY, data);
      this.useNearest = true;
    }

    PatchDataSet.prototype.toPatchVar = function(name) {
      var i, k, len, p, ref;
      ref = this.model.patches;
      for (i = k = 0, len = ref.length; k < len; i = ++k) {
        p = ref[i];
        p[name] = this.data[i];
      }
      return null;
    };

    return PatchDataSet;

  })(DataSet);

}).call(this);