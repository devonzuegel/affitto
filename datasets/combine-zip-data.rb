require 'csv'
require 'awesome_print'

EXPANDED_ZIP_DATA_FILE = '_zip_data.csv'
COMBINED_ZIP_DATA_FILE = '_combined_zip_data.csv'

coord_group, group_count = { lat: 22, lng: -160 }, 0
group_sizerank_sum, group_price_sum = 0, 0
combined_zips = []

CSV.foreach(EXPANDED_ZIP_DATA_FILE) do |line|
  curr_coords = { lat: line[2].to_i, lng: line[3].to_i }

  if coord_group == curr_coords or coord_group == nil
    group_count        += 1
    group_sizerank_sum += line[0].to_i
    group_price_sum    += line[1].to_i
  else
    avg_sizerank = group_sizerank_sum / (1.0 * group_count)
    avg_price    = group_price_sum / (1.0 * group_count)
    row = [avg_sizerank, avg_price, coord_group[:lat], coord_group[:lng]]
    combined_zips << row

    # Reset for next group
    coord_group = curr_coords
    group_count = 0
  end
end

ap combined_zips.length

CSV.open(COMBINED_ZIP_DATA_FILE, 'w') do |csv|
  combined_zips.each do |row|
    csv << row
  end
end