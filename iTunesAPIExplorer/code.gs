// Custom menu - https://developers.google.com/apps-script/reference/base/menu
function onOpen() {
  var ui = SpreadsheetApp.getUi()
  ui.createMenu('iTunes Menu')
    .addItem('Get Artist Data', 'displayArtistData')
    .addToUi()
}

function calliTunesAPI(artist) {
  //  Call the iTunes API
  var response = UrlFetchApp.fetch("https://itunes.apple.com/search?term=" + artist + "&limit=100")
  //  Parse the JSON reply
  var json = response.getContentText()
  // var data = JSON.parse(json)
  // Logger.log(data['results'])
  return JSON.parse(json)
}

function displayArtistData() {
  // Get search keyword
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getActiveSheet()

  var artist = sheet.getRange(4, 2).getValue()
  var tracks = calliTunesAPI(artist)
  var results = tracks["results"]

  var output = []

  results.forEach(function(elm, i) {
    var image = '=image("' + elm["artworkUrl60"] + '",4,60,60)'
    var hyperlink = '=hyperlink("' + elm["previewUrl"] + '","Listen to preview")'
    output.push([elm["artistName"],elm["collectionName"],elm["trackName"],image,hyperlink])
    sheet.setRowHeight(i+8, 65)
  })

  // sort by album
  var sortedOutput = output.sort( function(a,b) {
    
    var albumA = (a[1]) ? a[1] : 'Not known';  // in case album name undefined 
    var albumB = (b[1]) ? b[1] : 'Not known';  // in case album name undefined
    
    if (albumA < albumB) { return -1; } else if (albumA > albumB) {
      return 1
    }
    // names are equal
    return 0
  })

  // adds an index number to the array
  sortedOutput.forEach(function(elem,i) {
    elem.unshift(i + 1)
  })

  var len = sortedOutput.length

  // clear any previous content
  sheet.getRange(8,1,500,6).clearContent()

  // paste in the values
  sheet.getRange(8,1,len,6).setValues(sortedOutput)

  // formatting
  sheet.getRange(8,1,500,6).setVerticalAlignment("middle")
  sheet.getRange(8,5,500,1).setHorizontalAlignment("center")
  sheet.getRange(8,2,len,3).setWrap(true)
}