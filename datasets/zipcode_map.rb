require 'csv'
require 'awesome_print'
require 'histogram/array'

DATA_FILE = '_zip_data.csv'
FILENAME  = '_zip_data_within_range.csv'

def get_ranges
  lats, lngs = [], []
  CSV.foreach(DATA_FILE) do |line|
    lats << line[2].to_i
    lngs << line[3].to_i
  end

  (bins, hist) = lats.histogram(bins: 45, min: lats.min, max: lats.max)
  lat_min, lat_max = bins[0].round, bins[-1].round


  (bins, hist) = lngs.histogram(bins: 45, min: lngs.min, max: lngs.max)
  lng_min, lng_max = bins[0].round, bins[-1].round

  puts "#{lat_min} - #{lat_max} = #{lat_max - lat_min}"
  puts "#{lng_min} - #{lng_max} = #{lng_max - lng_min}"

  { lat: { min: lat_min, max: lat_max }, lng: { min: lng_min, max: lng_max } }
end

ap get_ranges