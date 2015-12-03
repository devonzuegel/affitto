u = ABM.Util; Shapes = ABM.Shapes; Maps = ABM.ColorMaps
log = (arg) -> console.log arg

TURTLE_POP     = 500
TURTLE_SIZE    = 0.8
TURTLE_VAR     = 3
STDEV          = 40
ANIMATION_RATE = 5

# The following min/max values were found with the zipcode_map.rb script.
LAT_RANGE      = [20, 64]
LNG_RANGE      = [-159, -60]

class MyModel extends ABM.Model
  gaussian_approx: (_min = 0, _max = 1) ->
    result       = 0
    n_iterations = 3
    for i in [0...n_iterations]
      result += @random_num(_max, _min)
    return result / (1.0 * n_iterations)

  new_price: (p)               ->  Math.floor @gaussian_approx(p.desirability - STDEV, p.desirability + STDEV)
  patch_utility: (p)           ->  p.desirability - p.price + @random_num(-TURTLE_VAR, TURTLE_VAR)
  random_num: (_max, _min = 0) ->  Math.floor(Math.random() * (_max - _min) + _min)

  initialize_patch: (p) ->
    p.desirability = -1
    p.price        = Number.POSITIVE_INFINITY
    p.color        = '#A7D9F6'

  initialize_turtle: (t) ->
    t.shape     = 'person'
    t.color     = '#555555'
    # t.penDown   = true
    random_i    = @random_num(@land_patches.length - 1)
    # @land_patches[random_i].color = '#555'
    t.moveTo(@land_patches[random_i])

  # Initialize our model via the `setup` abstract method (called by Model.constructor).
  setup: ->
    @population  = TURTLE_POP
    @size        = TURTLE_SIZE                # size in patch coords

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
      patch.desirability = @gaussian_approx(p.desirability - STDEV, p.desirability + STDEV)
      # log patch.desirability
      patch.price        = zip[1]
    @turtles.create(@population, (t) => @initialize_turtle(t))  # Create `population` # of turtles.

  # Update our model via the second abstract method, `step` (called by Model.animate).
  step: ->
    @updatePatch(p)  for p in @patches
    @updateTurtle(t) for t in @turtles
    @refreshPatches = true

    ## TODO desirability could depend on being near friends / overcrowding

    if @anim.ticks % 100 is 0  # Every 100 steps.
      @reportInfo()
      @setSpotlight @turtles.oneOf() if @anim.ticks is 300
    if @anim.ticks > 100
      log ".. and now we're done! Restart with app.start()"
      @stop()

  updateTurtle: (t) ->
    best_so_far = t.p
    for patch in @land_patches
      best_so_far = patch if (@patch_utility(patch) > @patch_utility(best_so_far))
    t.moveTo(best_so_far)

  updatePatch: (p) ->   # p is patch
    n_turtles = p.turtlesHere().length
    if n_turtles > 1
      p.desirability = 10 - n_turtles
    else if n_turtles < 1
      p.desirability = 1
    else
      p.desirability = 10

    p.desirability *= 50 + @gaussian_approx(-10, 10)
    p.price = @gaussian_approx(-10, 10)

  reportInfo: ->
    # Report the average heading, in radians and degrees
    headings = @turtles.getProp "heading"
    avgHeading = (headings.reduce (a,b) -> a + b) / @turtles.length
    # Note: multiline strings. block strings also available.
    # log "average heading of turtles:
    #      #{avgHeading.toFixed(2)} radians,
    #      #{u.radToDeg(avgHeading).toFixed(2)} degrees"

# Now that we've build our class, we call it with Model's
# constructor arguments:
#     divName, patchSize, minX, maxX, minY, maxY,
#     isTorus = false, hasNeighbors = true
model = new MyModel({
  div:          "layers",
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
