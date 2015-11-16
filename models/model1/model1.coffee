# ABM.Util, ABM.Shapes, ABM.ColorMaps aliases
u   = ABM.Util; Shapes = ABM.Shapes; Maps = ABM.ColorMaps
log = (arg) -> console.log arg


class MyModel extends ABM.Model
  gaussian_approx: (_min = 0, _max = 1) ->
    result = -1
    while result < 0
      curve  = ( ( Math.random() + Math.random() + Math.random() + Math.random() +
                   Math.random() + Math.random() + Math.random() + Math.random() ) - 4) / 4
      diff   = _max - _min
      middle = _max - diff / 2.0
      result = middle + diff * curve
    result

    # diff  = max - min
    # return max + diff*curve

  # Initialize our model via the `setup` abstract method.
  # This model simply creates `population` turtles with
  # arbitrary shapes with `size` size and `speed` velocity.
  # We also periodically change the patch colors to random gray values.
  setup: -> # called by Model.constructor
  # First, we initialize our model instance variables.
  # Most instance variables are parameters we would like
  # an external UI to setup for us.
    @population = 3
    @size       = 0.9             # size in patch coords
    @speed      = 100             # move forward this amount in patch coords
    @wiggle     = u.degToRad(100)  # degrees/radians to wiggle
    @initial_price_range = [0, 100]

    # Set the turtle to convert shape to bitmap for better performance.
    @turtles.setUseSprites()
    @turtles.setDefault 'size', @size
    @anim.setRate 30, false  # Set animation to 30fps, without multiple steps per draw:

    for p in @patches  # Initialize patches.
      p.price = @gaussian_approx(@initial_price_range[0], @initial_price_range[1])
      color = Math.floor(p.price)
      p.color = Maps.randomGray(color, color)

    for a in @turtles.create @population  # Create `population` turtles.
      a.shape = 'person'

  # Update our model via the second abstract method, `step` (called by Model.animate).
  step: ->
    @updateTurtles(a) for a in @turtles

    if @anim.ticks % 100 is 0  # Every 100 steps.
      @updatePrices(p) for p in @patches
      @reportInfo()
      @refreshPatches = true

      # Add use of our first pull request:
      @setSpotlight @turtles.oneOf() if @anim.ticks is 300
    else
      @refreshPatches = false

  # Three of our own methods to manage turtles & patches
  # and report model state.
  updateTurtles: (t) ->   # `t` is turtle
    # Have our turtle "wiggle" by changing its heading by +/- `wiggle/2` radians.
    t.rotate u.randomCentered @wiggle
    # Then move forward by our speed.
    t.forward @speed
    # Slow down speed over time
    @speed /= 1.01

  updatePrices: (p) ->   # p is patch
    # TODO

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
  size:         20,
  minX:         -16,
  maxX:         16,
  minY:         -16,
  maxY:         16,
  isTorus:      true,
  hasNeighbors: false
})
.debug() # Debug: Put Model vars in global name space
.start() # Run model immediately after startup initialization
