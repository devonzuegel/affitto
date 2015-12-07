u = ABM.Util; Shapes = ABM.Shapes; Maps = ABM.ColorMaps
log = (arg) -> console.log arg

TURTLE_SIZE    = 0.75
ANIMATION_RATE = 5

TURTLE_POP     = 200
TURTLE_VAR     = 10000
PRICE_VAR      = 100
STABILITY      = 0.9894  # Each year, approximately 12% of American households move.
                         # => census.gov/newsroom/press-releases/2015/cb15-47.html
NBR_RADIUS     = 3
NBR_DISCOUNT   = 1
OVERPOP_COST   = 400
DIST_COST      = 10
IDEAL_POP      = 2

# The following min/max values were found with the zipcode_map.rb script.
LAT_RANGE      = [  20,  64]
LNG_RANGE      = [-159, -60]

class MyModel extends ABM.Model
  gaussian_approx: (_min = 0, _max = 1) ->
    result       = 0
    n_iterations = 3
    for i in [0...n_iterations]
      result += @random_num(_max, _min)
    return result / (1.0 * n_iterations)

  distance_cost: (patch1, patch2) ->
    dist = Math.sqrt( (patch1.x - patch2.x)^2 + (patch1.y - patch2.y)^2 )
    DIST_COST*Math.log(dist + 1)

  set_population: (pop) ->
    change = pop - @population
    if change < 0
      t.die()    for t in @turtles.nOf(-change)
    if change > 0
      @turtles.create(change, (t) => @initialize_turtle(t))
    @population = pop

  patch_utility: (p, t) ->
    p.desirability - p.price - @distance_cost(p, t.p) + @random_num(-TURTLE_VAR, TURTLE_VAR)

  shuffle_array: (array)       ->
    for i in [0...array.length - 1]
      j        = Math.floor(Math.random() * (i + 1))
      temp     = array[i]
      array[i] = array[j]
      array[j] = temp
    array

  initialize_patch: (p) ->
    p.desirability = Number.NEGATIVE_INFINITY
    p.price        = Number.POSITIVE_INFINITY
    p.color        = '#A7D9F6'

  initialize_turtle: (t) ->
    t.shape  = 'person'
    t.color  = '#ffffff'
    random_i = @random_num(@land_patches.length - 1)
    t.moveTo(@land_patches[random_i])

  new_price: (p)               ->  Math.floor @gaussian_approx(p.desirability - PRICE_VAR, p.desirability + PRICE_VAR)
  random_num: (_max, _min = 0) ->  Math.floor(Math.random() * (_max - _min) + _min)
  unique_array: (a)            -> a.filter((item, pos) -> a.indexOf(item) == pos)

  # Initialize our model via the `setup` abstract method (called by Model.constructor).
  setup: ->
    @set_population(TURTLE_POP)
    @size = TURTLE_SIZE   # size in patch coords

    @turtles.setUseSprites()  # Convert turtle shape to bitmap for better performance.
    @turtles.setDefault 'size', @size
    @anim.setRate ANIMATION_RATE, false

    @initialize_patch(p) for p in @patches
    @land_patches = []
    for zip in zipcodes
      patch = @patches.patch(zip[3], zip[2])
      @land_patches.push(patch)
      patch.color = 'white'
      patch.sizerank = zip[0]
      patch.price = zip[1]
      patch.desirability = @gaussian_approx(p.price - PRICE_VAR, p.price + PRICE_VAR)
    @land_patches = @unique_array(@land_patches)
    @turtles.create(@population, (t) => @initialize_turtle(t))  # Create `population` # of turtles.

  # Update our model via the second abstract method, `step` (called by Model.animate).
  step: ->
    # log @anim.ticks
    @updatePatch(p)  for p in @land_patches
    @updateTurtle(t) for t in @turtles
    @refreshPatches = true
    # @anim.stop() if @anim.ticks == 3

  updateTurtle: (t) ->
    return if (Math.random() < STABILITY)
    best_so_far         = t.p
    best_so_far_utility = @patch_utility(best_so_far, t)

    # Without shuffling, we get a bias towards east coast patches since they show up
    # later in the @land_patches array.
    for patch in @shuffle_array(@land_patches)
      if (@patch_utility(patch, t) > best_so_far_utility)
        best_so_far         = patch
        best_so_far_utility = @patch_utility(best_so_far, t)

    log "old: (#{t.p.x}, #{t.p.y})    utility = #{@patch_utility(t.p, t)}"
    log "    p.desirability          =#{t.p.desirability}"
    log "    -p.price                =#{-t.p.price}"
    log "    -@distance_cost(p, t.p) =#{-@distance_cost(t.p, t.p)^DIST_COST}"

    log "new: (#{best_so_far.x}, #{best_so_far.y})    utility = #{@patch_utility(best_so_far, t)}"
    log "    p.desirability          =#{best_so_far.desirability}"
    log "    -p.price                =#{-best_so_far.price}"
    log "    -@distance_cost(p, t.p) =#{-@distance_cost(best_so_far, t.p)^DIST_COST}"

    log '=> MOVED' unless @distance_cost(t.p, best_so_far) == 0
    log ''
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
    p.desirability = if (n_turtles > IDEAL_POP) then -OVERPOP_COST*n_turtles else OVERPOP_COST*n_turtles

    nbr_patches      = @patches.inRadius(p, NBR_RADIUS)
    random_nbr_patch = nbr_patches[@random_num(nbr_patches.length - 1)]
    p.desirability  += random_nbr_patch.turtlesHere().length / (NBR_DISCOUNT * 1.0)

    # p.desirability += @gaussian_approx(-1, 1)
    p.price = 60000 if p.price == Infinity
    p.price = p.price + 1000 * (n_turtles - IDEAL_POP) + @gaussian_approx(-1, 1)
    color   = Math.max(0, Math.min(150, Math.ceil(150 * p.price / (1000000.0))))  # TODO smooth out colors

    # log color
    # log color
    if n_turtles > 55
      log n_turtles
      log p.price
    p.color = Maps.randomGray(color, color)


# Now that we've build our class, we call it with Model's
# constructor arguments:
#     divName, patchSize, minX, maxX, minY, maxY,
#     isTorus = false, hasNeighbors = true
model = new MyModel({
  div:          'layers',
  size:         14,
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
  'population': {
    type: 'slider',
    min: 0,
    max: 1000,
    step: 1,
    val: TURTLE_POP,
    smooth: false,
    setter: 'set_population'
  }
})
