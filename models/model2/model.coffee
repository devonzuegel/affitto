u = ABM.Util; Shapes = ABM.Shapes; Maps = ABM.ColorMaps
log = (arg) -> console.log arg

TURTLE_SIZE    = 0.75
ANIMATION_RATE = 100
TURTLE_POP     = 200

TURTLE_VAR     = 100      # Range of variance within turtle preferences.

PRICE_VAR      = 10       # Range of variance within prices.

NBR_RADIUS     = 2        # The radius (in #s of patches) in which to count neighbors.

NBR_COEFFIC    = 1        # How much to weight the number of neighbors.

OVERPOP_COST   = 10000    # The coefficient that determines that importance of the number of turtles
                          # sharing a given patch.

DIST_COST      = 100      # The coefficient on the cost of moving far (which is a logarithmic
                          # function on the distance of the move).

PROB_RENT_CONTROL = 0.2   # The probability that a given patch's price is restricted by rent-control.

MAX_PRICE      = 100000   # The max price imposed by "rent control".

DEFAULT_PRICE  = 188900   # We initialize patches in our ABM map with the average home values of the
                          # corresponding zip codes. The data contained some irregularities, resulting
                          # in "infinity" for some of these prices. To smooth out these irregularities,
                          # we replace these values with the average home value across the entire USA,
                          # which happens to be $188,900.

MAX_PATCH_POP  = 9        # Simulates height/density regulations (like those imposed in SF).

IDEAL_POP      = 1        # The patch population at which the desirability of that patch is
                          # maximized. If it is above this value, the patch loses value

STABILITY      = 0.9894   # Each year, approximately 12% of American households move.
                          # => census.gov/newsroom/press-releases/2015/cb15-47.html


# The following min/max values were found with the zipcode_map.rb script. They describe the
# ranges of our map.
LAT_RANGE      = [  20,  64]
LNG_RANGE      = [-159, -60]

class MyModel extends ABM.Model
  set_animation_rate: (anim_rate) ->    @anim.setRate anim_rate, false
  set_price_var: (v) ->                 @price_var         = v
  set_nbr_radius: (r) ->                @nbr_radius        = r
  set_dist_cost_k: (c) ->               @dist_cost_k       = c
  set_overpop_cost_k: (c) ->            @overpop_cost_k    = c
  set_rent_control_prob: (prob) ->
    @prob_rent_control = prob
    @initialize_patch(p) for p in @patches
  set_overpop_cost_k: (c) ->            @overpop_cost_k    = c
  set_max_price: (p) ->                 @max_price         = p
  set_max_patch_pop: (pop) ->           @max_patch_pop     = pop
  set_ideal_pop: (pop) ->               @ideal_pop         = pop
  set_stability: (s) ->                 @stability         = s

  gaussian_approx: (_min = 0, _max = 1) ->
    result       = 0
    n_iterations = 3
    for i in [0...n_iterations]
      result += @random_num(_max, _min)
    return result / (1.0 * n_iterations)

  distance_cost: (patch1, patch2) ->
    dist = Math.sqrt( (patch1.x - patch2.x)^2 + (patch1.y - patch2.y)^2 )
    @dist_cost_k * Math.log(dist + 1)

  set_population: (pop) ->
    change = pop - @population
    if change < 0
      t.die()    for t in @turtles.nOf(-change)
    if change > 0
      @turtles.create(change, (t) => @initialize_turtle(t))
    @population = pop

  patch_utility: (p, t) ->
    p.desirability - p.price - @distance_cost(p, t.p) + @random_num(-TURTLE_VAR, TURTLE_VAR)

  shuffle_array: (array) ->
    for i in [0...array.length - 1]
      j        = Math.floor(Math.random() * (i + 1))
      temp     = array[i]
      array[i] = array[j]
      array[j] = temp
    array

  initialize_patch: (p) ->
    p.rent_control = (Math.random() < @prob_rent_control)
    p.desirability = Number.NEGATIVE_INFINITY
    p.price        = Number.POSITIVE_INFINITY
    p.color        = '#A7D9F6'  # blue colored "water"

  initialize_turtle: (t) ->
    t.shape  = 'person'
    random_i = @random_num(@land_patches.length - 1)
    t.moveTo(@land_patches[random_i])
    t.color = if @land_patches[random_i].rent_control then 'orange' else 'white'

  new_price: (p)               ->  Math.floor @gaussian_approx(p.desirability - @price_var, p.desirability + @price_var)
  random_num: (_max, _min = 0) ->  Math.floor(Math.random() * (_max - _min) + _min)
  unique_array: (a)            -> a.filter((item, pos) -> a.indexOf(item) == pos)

  # Initialize our model via the `setup` abstract method (called by Model.constructor).
  setup: ->
    @set_population(TURTLE_POP)
    @set_animation_rate(ANIMATION_RATE)
    @set_price_var(PRICE_VAR)
    @set_nbr_radius(NBR_RADIUS)
    @set_dist_cost_k(DIST_COST)
    @set_overpop_cost_k(OVERPOP_COST)
    @set_rent_control_prob(PROB_RENT_CONTROL)
    @set_max_price(MAX_PRICE)
    @set_max_patch_pop(MAX_PATCH_POP)
    @set_ideal_pop(IDEAL_POP)
    @set_stability(STABILITY)

    @turtles.setUseSprites()  # Convert turtle shape to bitmap for better performance.
    @turtles.setDefault 'size', TURTLE_SIZE

    @initialize_patch(p) for p in @patches
    @land_patches = []
    for zip in zipcodes
      patch = @patches.patch(zip[3], zip[2])
      @land_patches.push(patch)
      patch.sizerank = zip[0]
      patch.price = zip[1]
      color   = Math.max(0, Math.min(150, Math.ceil(150 * p.price / (1000000.0))))  # TODO smooth out colors
      p.color = Maps.randomGray(color, color)
      patch.desirability = 0
    @land_patches = @unique_array(@land_patches)
    @turtles.create(@population, (t) => @initialize_turtle(t))  # Create `population` # of turtles.

  # Update our model via the second abstract method, `step` (called by Model.animate).
  step: ->
    # log @anim.ticks
    # @anim.stop()# if @anim.ticks == 3
    @updatePatch(p)  for p in @land_patches
    @updateTurtle(t) for t in @turtles
    @refreshPatches = true

    # Log total utility. Currently it's always negative, but that's just a result of the way we set
    # our various parameters. What matters is the relative value of possible utilities for a given turtle,
    # not the absolute value. (We're assuming that turtles don't commit suicide here, but they are
    # utility-maximizing agents.)
    old_this = this
    total_utility = (@turtles.map (t) -> old_this.patch_utility(t.p, t)).reduce (a, b) -> a + b
    $('#total-utility').text("Total utility = #{total_utility}")

  updateTurtle: (t) ->
    return if (Math.random() < @stability)
    best_so_far         = t.p
    best_so_far_utility = @patch_utility(best_so_far, t)
    original_utility    = @patch_utility(t.p, t)

    # Without shuffling, we get a bias towards east coast patches since they show up
    # later in the @land_patches array.
    for patch in @shuffle_array(@land_patches)
      n_turtles = patch.turtlesHere().length
      if n_turtles > @max_patch_pop
        continue
      if (@patch_utility(patch, t) > best_so_far_utility)
        best_so_far         = patch
        best_so_far_utility = @patch_utility(best_so_far, t)

    # log "old: (#{t.p.x}, #{t.p.y})    utility = #{@patch_utility(t.p, t)}"
    # log "    p.desirability          =#{t.p.desirability}"
    # log "    -p.price                =#{-t.p.price}"
    # log "    -@distance_cost(p, t.p) =#{-@distance_cost(t.p, t.p)^DIST_COST}"

    # log "new: (#{best_so_far.x}, #{best_so_far.y})    utility = #{@patch_utility(best_so_far, t)}"
    # log "    p.desirability          =#{best_so_far.desirability}"
    # log "    -p.price                =#{-best_so_far.price}"
    # log "    -@distance_cost(p, t.p) =#{-@distance_cost(best_so_far, t.p)^DIST_COST}"

    # log '=> MOVED' unless @distance_cost(t.p, best_so_far) == 0
    # log ''
    t.color = if best_so_far.rent_control then 'orange' else 'white'
    t.moveTo(best_so_far)

  updatePatch: (p) ->   # p is patch
    ### TODO: things to incoprorate:
    - desirability could depend on being near friends / overcrowding
      + incorporate population of this patch and also of neighboring patches
    - how long a patch has been left empty >> price lowers a lot
    - turtle less likely to move if he moved recently
    - turtles prefer to not move long distances if possible (cost to distance from
      current patch to next patch)
    ###
    n_turtles = p.turtlesHere().length
    p.desirability = -@overpop_cost_k * Math.abs(@ideal_pop - n_turtles)

    nbr_patches      = @patches.inRadius(p, @nbr_radius)
    random_nbr_patch = nbr_patches[@random_num(nbr_patches.length - 1)]
    p.desirability  += random_nbr_patch.turtlesHere().length * NBR_COEFFIC

    # p.desirability += @gaussian_approx(-1, 1)
    p.price = DEFAULT_PRICE if p.price == Infinity
    p.price = Math.max(0, p.price - @overpop_cost_k * (@ideal_pop - n_turtles + @gaussian_approx(-@price_var, @price_var)))
    p.price = Math.min(@max_price, p.price) if p.rent_control

    color   = Math.max(0, Math.min(150, Math.ceil(150 * p.price / (1000000.0))))  # TODO smooth out colors
    p.color = Maps.randomGray(color, color)


# Now that we've build our class, we call it with Model's
# constructor arguments:
#     divName, patchSize, minX, maxX, minY, maxY,
#     isTorus = false, hasNeighbors = true
model = new MyModel({
  div:          'layers',
  size:         15,
  minX:         LNG_RANGE[0],
  maxX:         LNG_RANGE[1],
  minY:         LAT_RANGE[0],
  maxY:         LAT_RANGE[1],
  isTorus:      false,
  hasNeighbors: false
})
.debug() # Debug: Put Model vars in global name space
.start() # Run model immediately after startup initialization

gui = new ABM.DatGUI(model, {
  'Population': {
    type:   'slider',
    min:    0,
    max:    1000,
    step:   1,
    val:    TURTLE_POP,
    smooth: false,
    setter: 'set_population'
  },

  'Animation Rate': {
    type:   'slider',
    min:    1,
    max:    200,
    step:   1,
    val:    ANIMATION_RATE,
    smooth: false,
    setter: 'set_animation_rate'
  }

  'Neighbor Radius': {
    type: 'slider',
    min: 1,
    max: 50,
    step: 1,
    val: NBR_RADIUS,
    smooth: false,
    setter: 'set_nbr_radius'
  }

  'Distance Cost Coefficient': {
    type: 'slider',
    min: 1,
    max: 300,
    step: 1,
    val: DIST_COST,
    smooth: false,
    setter: 'set_dist_cost_k'
  }

  'Overpopulation Cost Coefficient': {
    type: 'slider',
    min: 1,
    max: 100 * 1000,
    step: 1,
    val: OVERPOP_COST,
    smooth: false,
    setter: 'set_overpop_cost_k'
  }

  '% of Properties Under Rent Control': {
    type: 'slider',
    min: 0,
    max: 1,
    step: 0.01,
    val: PROB_RENT_CONTROL,
    smooth: true,
    setter: 'set_rent_control_prob'
  }

  'Rent Controlled Price': {
    type: 'slider',
    min: 0,
    max: 1000000,
    step: 0.01,
    val: MAX_PRICE,
    smooth: false,
    setter: 'set_max_price'
  }

  'Max Density': {
    type: 'slider',
    min: 0,
    max: 100,
    step: 1,
    val: MAX_PATCH_POP,
    smooth: false,
    setter: 'set_max_patch_pop'
  }

  'Ideal Population': {
    type: 'slider',
    min: 1,
    max: 100,
    step: 1,
    val: IDEAL_POP,
    smooth: false,
    setter: 'set_ideal_pop'
  }

  'Stability': {
    type: 'slider',
    min: 0,
    max: 1,
    step: 0.00001,
    val: STABILITY,
    smooth: true,
    setter: 'set_stability'
  }
})
