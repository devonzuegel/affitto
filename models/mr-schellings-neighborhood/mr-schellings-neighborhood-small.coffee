class Neighborhood extends ABM.Model
  startup: ->
    @colors = [
      { color: [255, 255, 255], label: 'white' },
      { color: [110, 220, 255], label: 'blue'  },
      { color: [235, 140, 140], label: 'red'   }
    ]
    @percent_open = 1
    @threshold    = 2
    @open_patches = []
    console.log 'Setup complete!'

  setup: ->
    for p in @patches
      if Math.random() < @percent_open * 0.01
        @set_blank(p)
      else if Math.random() < 0.5
        @set_team(p, 1)
      else
        @set_team(p, 2)

  step: ->
    if @anim.ticks % 2 is 1
      @count_neighbors()
    else
      @enact_movement()

  count_neighbors: () ->
    @open_patches = []
    for p in @patches
      if @linkEnabled
        patch = @linkedModel.patches.patch(p.x, p.y)
      else
        patch = p

      if p.team is 0
        @open_patches.push(p)
      else
        p.friendly_neighbors = patch.n.with((p) -> p.team == patch.team).length

  enact_movement: ->
    for p in @patches
      if p.friendly_neighbors <= @threshold
        @move(p)

  set_team: (p, team) ->
    p.team  = team
    p.color = @colors[team].color
    p.label = @colors[team].label

  move: (old_patch) ->
    if @open_patches.length > 0
      i = @_randomNum(@open_patches.length)
      @set_team(@open_patches[i], old_patch.team)
      @open_patches.splice(i, 1)
      @set_blank(old_patch)

  set_blank: (p) ->
    @set_team(p, 0)
    @open_patches.push(p)

  reset_model: () ->
    @reset()
    @start()

  toggleLink: () ->
    @linkEnabled = @linkedModel.linkEnabled = not @linkEnabled

  log: (p) ->
    console.log "(#{p.x}, #{p.y}) #{p.label} #{p.friendly_neighbors}"

  _randomNum: (max,min = 0) ->
    return Math.floor(Math.random() * (max - min) + min)

  set_threshold: (@threshold) -> @reset_model()
  set_open: (@percent_open)   -> @reset_model()


modelOpts = { size: 5, minX: 0, maxX: 150, minY: 0, maxY: 45, div: 'model' }
model = window.model = new Neighborhood(modelOpts)

model.on 'step', () ->
  if (model.anim.ticks % 100 is 0)
    console.log "model:", model.anim.toString()

model.on 'draw', () ->
  if (model.anim.draws % 100 is 0)
    console.log "model:", model.anim.toString()

window.gui1 = new ABM.DatGUI(model, {
  "RESET MODEL": {
    type: "button",
    setter: "reset_model"
  },
  "Threshold": {
    type: "slider"
    min: 0
    max: 7
    step: 1
    val: model.threshold
    smooth: false
    setter: "set_threshold"
  },
  "Percent open": {
    type: "slider"
    min: 0.1
    max: 100
    step: 0.2
    val: model.percent_open
    smooth: true
    setter: "set_open"
  }
})

model.start()