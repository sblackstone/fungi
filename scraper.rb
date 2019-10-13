require 'nokogiri'
require 'open-uri'
require 'pry'
# Fetch and parse HTML document

url = 'https://en.wikipedia.org/w/index.php?title=Special:WhatLinksHere/Template:Mycomorphbox&namespace=0&limit=50000'
doc = Nokogiri::HTML(open(url))

results = []

doc.css("#mw-whatlinkshere-list li > a").each do |d|

  href =

  pageUrl = "https://en.wikipedia.org/#{d.attributes["href"].value}?action=edit"
  pageDoc = Nokogiri::HTML(open(pageUrl))
  box = pageDoc.content.match(/\{\{mycomorphbox[^\}]*/m)

  rows =  box.to_s.split("\n").map {|x| x.gsub(/^\|\ */, '') }

  pairs = rows.map {|x| x.split("=") }.reject {|x| x.length != 2 }

  result = {}
  pairs.each do |p|
    result[p[0].strip] = p[1].strip
  end
  results.push(result)

end


puts results.to_json
