# Affitto #

## About the project ##

Affitto is a suite of agent-based models (ABMs) that explores the emergent behavior within housing markets and the impact of rent control and other zoning regulations.

## Contributing to our models ##

All of our models (including a template and examples) can be found in the `/models` directory. All examples are standalone `.html` files with inline coffeescript, while the template model follows the same structure as each of our custom models:

```bash
/model-name
    model-name.coffee  # The coffeescript file in which we do most of our work.
    model-name.html    # The html page that contains the dynamic model.
    model-name.js      # The compiled version of `model-name.coffee`.
```

#### Working in Coffeescript ####

To install Coffeescript, Browserify, and Coffeeify with the Node Package Manager:

```bash
$ sudo npm install -g coffee-script
$ sudo npm install -g browserify
$ sudo npm install -g coffeeify
```

To continuously compile coffeescript into the `.js` files required in the models `.html`, run the following:

```bash
$ watch -n 2 'rm model.js; browserify -t coffeeify --extension=".coffee" model.coffee > model.js'
```

For example, when working on our template model:

```bash
$ cd models/_tempate/
$ coffee -wc -o . *.coffee

6:51:06 PM - compiled /Users/devonzuegel/Github/affitto/models/_template/template.coffee
```

## AgentScript ##

Our work relies heavily on [AgentScript](http://agentscript.org/), a minimalist Agent Based Modeling framework in Javascript/Coffescript based on NetLogo agent semantics. The framework has very thorough docs and modeling examples on their Github Pages site.

## Data ##

#### Origin of Data for Model 2 ####

