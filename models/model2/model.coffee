# ABM.Util, ABM.Shapes, ABM.ColorMaps aliases
u   = ABM.Util; Shapes = ABM.Shapes; Maps = ABM.ColorMaps
log = (arg) -> console.log arg

TURTLE_POP     = 3
TURTLE_SIZE    = 0.2
TURTLE_SPEED   = 0
TURTLE_WIGGLE  = 100
PRICE_RANGE    = [0, 255]
STDEV          = 50
ANIMATION_RATE = 2

class MyModel extends ABM.Model
  gaussian_approx: (_min = 0, _max = 1) ->
    result = 0
    n_iterations = 4
    for i in [0...4]
      result = @random_num(_max, _min)
    return result / (1.0 * n_iterations)


  new_price: (p)               ->  return Math.floor @gaussian_approx(p.desirability - STDEV, p.desirability + STDEV)
  new_desirability:            ->  return Math.floor @gaussian_approx(@price_range[0] + STDEV, @price_range[1] - STDEV)
  patch_utility: (p)           ->  return p.desirability - p.price
  random_num: (_max, _min = 0) ->  return Math.floor(Math.random() * (_max - _min) + _min)
  happiness_color: (t)         ->  ABM.Color.rgbaString(t.happiness, t.happiness, t.happiness)

  # Initialize our model via the `setup` abstract method (called by Model.constructor).
  setup: ->
    @population   = TURTLE_POP
    @size         = TURTLE_SIZE                # size in patch coords
    @speed        = TURTLE_SPEED               # move forward this amount in patch coords
    @wiggle       = u.degToRad(TURTLE_WIGGLE)  # degrees/radians to wiggle
    @price_range  = PRICE_RANGE

    @turtles.setUseSprites()  # Convert turtle shape to bitmap for better performance.
    @turtles.setDefault 'size', @size
    @anim.setRate ANIMATION_RATE, false

    for p in @patches  # Initialize patches.
      # @updatePatch(p, @new_price())
      p.desirability = @new_desirability()
      p.price        = @new_price(p)
      p.color        = Maps.randomGray(255-p.desirability, 255-p.desirability)

    for a in @turtles.create @population  # Create `population` # of turtles.
      a.shape = 'person'
      a.happiness = @patch_utility(a.p)
      a.color = @happiness_color(a)
      a.penDown = true
      a.moveTo(@patches[@random_num(@patches.length - 1)])

  # Update our model via the second abstract method, `step` (called by Model.animate).
  step: ->
    @updatePatch(p) for p in @patches
    @updateTurtle(t) for t in @turtles
    @refreshPatches = true

    ## TODO desirability could depend on being near friends / overcrowding

    if @anim.ticks % 100 is 0  # Every 100 steps.
      @reportInfo()
      @setSpotlight @turtles.oneOf() if @anim.ticks is 300
    if @anim.ticks > 10
      log ".. and now we're done! Restart with app.start()"
      @stop()

  updateTurtle: (t) ->
    current_rent = t.p.price  # Get the rent that turtle `t` is currently paying
    # Move to a patch with higher desirability
    for patch in t.p.inRadius(@patches, 2)
      if @patch_utility(patch) > t.happiness
        t.moveTo(patch)
        t.happiness = @patch_utility(patch)
        t.color     = @happiness_color(t)
        break

  updatePatch: (p) ->   # p is patch
    p.price += @random_num(-STDEV, STDEV)

  reportInfo: ->
    # Report the average heading, in radians and degrees
    headings = @turtles.getProp "heading"
    avgHeading = (headings.reduce (a,b) -> a + b) / @turtles.length
    # Note: multiline strings. block strings also available.
    log "average heading of turtles:
         #{avgHeading.toFixed(2)} radians,
         #{u.radToDeg(avgHeading).toFixed(2)} degrees"

# Now that we've build our class, we call it with Model's
# constructor arguments:
#
#     divName, patchSize, minX, maxX, minY, maxY,
#     isTorus = false, hasNeighbors = true
model = new MyModel({
  div:          "layers",
  size:         100,
  minX:         -3,
  maxX:         3,
  minY:         -3,
  maxY:         3,
  isTorus:      false,
  hasNeighbors: false
})
.debug() # Debug: Put Model vars in global name space
.start() # Run model immediately after startup initialization
