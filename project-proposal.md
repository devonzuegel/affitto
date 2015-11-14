Devon Zuegel & John Luttig &nbsp; // &nbsp; 14 Oct 2015 &nbsp; // &nbsp; CS 224W

# Introduction #

San Francisco and the greater Bay Area have a troublesome history when it comes to rent control, housing shortages, and zoning laws. Factors including the explosion of Silicon Valley have contributed to a shortage of housing that has led to the rethinking of housing and policy surrounding rental controls in the area. Given these radical shifts in both rent prices and attitudes, San Francisco-based and other city planners must make changes to housing and rental policies, but it is hard to anticipate the outcomes of policy changes in the long term. Agent-based modeling analysis may answer some of these questions by parameterizing some of the key factors surrounding housing policy and projecting the impact of battling policy proposals.

## Literature Survey ##

- [Agent-based modeling: Methods and techniques for simulating human systems](http://www.pnas.org/content/99/suppl_3/7280.full.pdf?sid=9c72ddfc-e9c9-4690-800e-b94ccae13a70)
- [Using Adaptive Agent-Based Simulation Models to Assist Planners in Policy Development: The Case of Rent Control](http://www.santafe.edu/research/working-papers/abstract/0cbe9b4e0fc8061589e453dea9f7721e/)

A particularly promising field in which to employ ABM is the housing and rental markets, using parameters such rent control, zoning laws, building height control, and tenant income levels to view the emergent properties of tenant-landlord networks. These parameters can be built into an easily navigable interface for the non-technical policy planners to test hypotheses about the future of housing in San Francisco and other cities.

We will apply agent-based modeling techniques to the question of rent control and other zoning regulations. We plan to leverage AgentScript, a javascript Minimalist Agent Based Modeling framework based on NetLogo, to analyze the emergent patterns based on various parameters related to these housing questions.

Our model will likely include the following parameters:

* desirability of the various housing options on the map
* number of housing units available of each level of desirability
* a distribution of tenant income levels
* a dynamic utility score for each tenant / landlord agent that varies according to their conditions
* rent control (or none)
* building height control (with density / people-per-block as a proxy for this variable)

We will include a control panel to enable seeing the changes in the system as we adjust each of these variables. There will also be a series of presets corresponding to the existing state of various city systems so we can see how well the simulation models real-life housing situations. There is a significant amount of data on these parameters for cities such as San Francisco, Chicago, and New York, so we plan to focus on those. Here are some of the sources we have found so far:

* San Francisco
   * 2013 Housing Inventory – data.sfgov.org/Housing-and-Buildings/2013-Housing-Inventory/e7d3-dxh5
   * Trulia home prices heat map – trulia.com/home_prices/California/San_Francisco-heat_map/
   * Rent stabilization by neighborhood – trulia.com/blog/trends/rent-control-sf-nyc/
   * CartoDB neighborhoods – common-data.cartodb.com/tables/sf_planning_neighborhoods/public
* New York City
   * Trulia home prices heat map – trulia.com/home_prices/New_York/New_York-heat_map/
   * Rent stabilization by neighborhood – trulia.com/blog/trends/rent-control-sf-nyc/
   * Rent-Stabilized addresses – github.com/clhenrick/dhcr-rent-stabilized-data


This project will happen over the course of several phases:


1. Familiarize ourselves with the AgentScript framework and modify it to fit our specific needs to model basic renter-tenant relationships.
2. Incorporate each of the parameters listed above and any others that we learn about over the course of further research.
3. Present the simulations in an interactive, easy-to-use way so that others can also tweak the parameters.
4. Build preset simulations for cities based on actual data (promising sources listed above).


To measure the success of the project, we will compare the simulation with actual behavior in the previously stated cities to see if our model accurately captures trends in the real world. Specifically, we will see if we can accurately predict the upwards or downwards movement of housing prices and density. Ideally we would also test our prediction of satisfaction (measured by a utility score) of the landlord / tenant agents in the program, but there’s no viable way to do that.

At the end of the quarter, we will submit our agent-based model. We will also submit a paper detailing the structure of the model, the results we found from it, and analysis of the economic theory and network properties that come into play with this network. A great advantage to ABMs is that they are highly interactive. We plan to leverage that by publishing the paper as a dynamic web page rather than a traditional PDF so we can include running examples side-by-side with our words, somewhat similar to the famous “Parable of Polygons”.