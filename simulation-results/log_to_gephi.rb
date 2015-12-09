require 'json'
require 'awesome_print'

FILENAMES = %w(4-pop-1000-without-rent-control)
           #%w(1-pop-200-with-rent-control 2-pop-1000-with-rent-control 3-pop-200-without-rent-control)

def log_filename(name)
  "#{name}.log"
end

def gephi_csv_filename(name)
  "#{name}.txt"
end

def array_to_csv(arr)
  "#{arr.join(',')}\n"
end

def get_nodes_edges(name)
  log_file = log_filename(name)
  unparsed_nodes, unparsed_edges = File.open(log_file).each_line.map { |i| i }
  [JSON.parse(unparsed_nodes), JSON.parse(unparsed_edges)]
end

def log_to_gephi(name)
  nodes, edges = get_nodes_edges(name)
  edges_info   = edges.uniq.map { |edge| edge + [edges.count(edge)] }

  File.open(gephi_csv_filename(name), 'w') do |f|
    f.write("nodedef>name,num_turtles INT,lat INT,long INT\n")
    nodes.each { |k, n| f.write(array_to_csv(n)) }

    f.write("\n")

    f.write("edgedef>node1,node2,weight DOUBLE\n")
    edges_info.each { |e| f.write(array_to_csv(e)) }
  end
end

FILENAMES.each { |f| log_to_gephi(f) }