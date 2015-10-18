Devon Zuegel & John Luttig &nbsp; // &nbsp; 14 Oct 2015 &nbsp; // &nbsp; CS 224W

# Project Proposal #

## Reaction ##


**Summary**

- What is main technical content of the papers?
- How do the papers relate to the topics presented in the course?
- What is the connection between the papers you are discussing?

**Critique**

- What are strengths and weaknesses of the papers and how could they be addressed?
- What were the authors missing?
- Was anything particularly unrealistic?

**Brainstorming (that then leads to the project proposal)**

- What are promising further research questions in the direction of the papers?
- How could they be pursued?
- An idea of a better model for something? A better algorithm? A test of a model or  - algorithm on a dataset or simulated data?


## Proposal ##

We will apply agent-based modeling techniques to the question of rent control and other zoning regulations. We plan to leverage [AgentScript](http://agentscript.org/), a javascript Minimalist Agent Based Modeling framework based on NetLogo, to analyze the emergent patterns based on various parameters related to these housing questions.

Our model will likely include the following parameters:

- desirability of the various housing options on the map
- number of housing units available of each level of desirability
- a distribution of tenant income levels
- a dynamic utility score for each tenant / landlord agent that varies according to their conditions
- rent control (or none)
- building height control (with density/people-per-block as a proxy for this variable)

We will include a control panel to enable seeing the changes in the system as we adjust each of these variables. There will also be a series of presets corresponding to the existing state of various city systems so we can see how well the simulation models real-life housing situations. There is a significant amount of data on these paramters for cities such as San Francisco, Chicago, and New York, so we plan to focus on those. Here are some of the sources we have found so far:

- San Francisco
    + 2013 Housing Inventory -- [data.sfgov.org/Housing-and-Buildings/2013-Housing-Inventory/e7d3-dxh5](http://data.sfgov.org/Housing-and-Buildings/2013-Housing-Inventory/e7d3-dxh5)
    + Trulia home prices heat map -- [trulia.com/home_prices/California/San_Francisco-heat_map/](http://www.trulia.com/home_prices/California/San_Francisco-heat_map/)
    + Rent stabilization by neighborhood -- [trulia.com/blog/trends/rent-control-sf-nyc/](http://www.trulia.com/blog/trends/rent-control-sf-nyc/)
    + CartoDB neighborhoods -- [common-data.cartodb.com/tables/sf_planning_neighborhoods/public](https://common-data.cartodb.com/tables/sf_planning_neighborhoods/public)
- New York City
    + Trulia home prices heat map -- [trulia.com/home_prices/New_York/New_York-heat_map/](http://www.trulia.com/home_prices/New_York/New_York-heat_map/)
    + Rent stabilization by neighborhood -- [trulia.com/blog/trends/rent-control-sf-nyc/](http://www.trulia.com/blog/trends/rent-control-sf-nyc/)
    + Rent-Stabilized addresses -- [github.com/clhenrick/dhcr-rent-stabilized-data](https://github.com/clhenrick/dhcr-rent-stabilized-data)

This project will happen over the course of several phases:

1. Familiarize ourselves with the AgentScript framework and modify it to fit our specific needs to model basic renter-tenant relationships.
2. Incorporate each of the parameters listed above and any others that we learn about over the course of further research.
3. Present the simulations in an interactive, easy-to-use way so that others can also tweak the parameters.
4. Build preset simulations for cities based on actual data (promising sources listed above).

To measure the success of the project, we will compare the simulation with actual behavior in the previously stated cities to see if our model accurately captures trends in the real world. Specifically, we will see if we can accurately predict the upwards or downwards movement of housing prices and density. Ideally we would also test our prediction of satisfaction (measured by a utility score) of the landlord / tenant agents in the program, but there's no viable way to do that.

At the end of the quarter, we will submit our agent-based model. We will also submit a paper detailing the structure of the model, the results we found from it, and analysis of the economic theory and network properties that come into play with this network. A great advantage to ABMs is that they are highly interactive. We plan to leverage that by publishing the paper as a dynamic web page rather than a traditional PDF so we can include running examples side-by-side with our words, somewhat similar to the famous ["Parable of Polygons"](http://ncase.me/polygons/).