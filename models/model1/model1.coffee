# ABM.Util, ABM.Shapes, ABM.ColorMaps aliases
u   = ABM.Util; Shapes = ABM.Shapes; Maps = ABM.ColorMaps
log = (arg) -> console.log arg


class MyModel extends ABM.Model
  gaussian_approx: (_min = 0, _max = 1) ->
    curve  = ( ( Math.random() + Math.random() + Math.random() + Math.random() +
                 Math.random() + Math.random() + Math.random() + Math.random() ) - 4) / 4
    diff   = _max - _min
    middle = _max - diff / 2.0
    return middle + diff * curve

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
    vals = 0
    nvals = 1000
    for i in [0..nvals]
      v = @gaussian_approx(0,100)
      vals += v
    log vals/nvals
    return

    @population = 3
    @size       = 0.9             # size in patch coords
    @speed      = 0.3             # move forward this amount in patch coords
    @wiggle     = u.degToRad(30)  # degrees/radians to wiggle

    # Set the turtle to convert shape to bitmap for better performance.
    @turtles.setUseSprites()
    @turtles.setDefault 'size', @size
    @anim.setRate 30, false  # Set animation to 30fps, without multiple steps per draw:

    for p in @patches  # Initialize patches.
      p.color = Maps.randomGray(0,100)
      p.price = 11111111

    for a in @turtles.create @population  # Create `population` turtles.
      a.shape = 'person'

    # for s in Shapes.names()  # Print number of turtles with each shape
    #   num = @turtles.getPropWith("shape", s).length
    #   log "#{num} #{s}"

    log @patches.patchXY 0,0

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

  updatePrices: (p) ->   # p is patch
    # Update patch colors to be a random gray.
    # u.randomGray(p.color) if p.x isnt 0 and p.y isnt 0 # aviod GC, reuse color
    # Avoid Garbage collection by using a colormap
    # p.color = Maps.randomColor() if p.x isnt 0 and p.y isnt 0

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
  div: "layers",
  size: 20,
  minX: -16,
  maxX: 16,
  minY: -16,
  maxY: 16,
  isTorus: true,
  hasNeighbors: false
})
.debug() # Debug: Put Model vars in global name space
.start() # Run model immediately after startup initialization
