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
- a distribution of renter income level
- rent control (or none)
- building height control (with density/people-per-block as a proxy for this variable)

We will include a control panel to enable seeing the changes in the system as we adjust each of these variables. There will also be a series of presets corresponding to the existing state of various city systems so we can see how well the simulation models real-life housing situations. There is a significant amount of data on these paramters for cities such as San Francisco, Chicago, and New York, so we plan to focus on those. Here is some of the sources we have found so far:

- San Francisco
    + 2013 Housing Inventory -- [data.sfgov.org/Housing-and-Buildings/2013-Housing-Inventory/e7d3-dxh5](http://data.sfgov.org/Housing-and-Buildings/2013-Housing-Inventory/e7d3-dxh5)
    + Trulia home prices heat map -- [trulia.com/home_prices/California/San_Francisco-heat_map/](http://www.trulia.com/home_prices/California/San_Francisco-heat_map/)
    + Rent stabilization by neighborhood -- [trulia.com/blog/trends/rent-control-sf-nyc/](http://www.trulia.com/blog/trends/rent-control-sf-nyc/)
    + CartoDB neighborhoods -- [common-data.cartodb.com/tables/sf_planning_neighborhoods/public](https://common-data.cartodb.com/tables/sf_planning_neighborhoods/public)
- New York City
    + Trulia home prices heat map -- [trulia.com/home_prices/New_York/New_York-heat_map/](http://www.trulia.com/home_prices/New_York/New_York-heat_map/)
    + Rent stabilization by neighborhood -- [trulia.com/blog/trends/rent-control-sf-nyc/](http://www.trulia.com/blog/trends/rent-control-sf-nyc/)
    + Rent-Stabilized addresses -- [github.com/clhenrick/dhcr-rent-stabilized-data](https://github.com/clhenrick/dhcr-rent-stabilized-data)
- 

This project will happen over the course of several phases:

1. Familiarize ourselves with the AgentScript framework and modify it to fit our specific needs to model basic renter-tenant relationships.
2. Incorporate each of the parameters listed above and any others that we learn about over the course of further research.
3. Present the simulations in an interactive, easy-to-use way so that others can also tweak the parameters.
4. Build preset simulations for cities based on actual data (promising sources listed above).

- What work do you plan to do for the project?
- Which algorithms/techniques/models do you plan to use/develop? Be as specific as you can!
- How will you evaluate your method? How will you test it? How will you measure success?
- What do you expect to submit/accomplish by the end of the quarter?

**Some other points to note:**

- The project should contain at least some amount of mathematical analysis, and some experimentation on real or synthetic data
- The result of the project will typically be a 8 page paper, describing the approach, the results, and the related work.
