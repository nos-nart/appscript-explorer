function onOpen(e) {
  var ui = SpreadsheetApp.getUi() 
  ui.createMenu('OMDB menu')
    .addItem('Search movie 👌', 'displayMovieData')
    .addToUi()
}

function queryMovie(searchKey) {
  var response = UrlFetchApp.fetch("http://www.omdbapi.com/?apikey=ed4e220e&s=" + searchKey)
  var json = response.getContentText()
  //  Logger.log(JSON.parse(json))
  return JSON.parse(json)
}

function displayMovieData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getActiveSheet()
  
  var searchKey = sheet.getRange(4, 2).getValue()
  var movies = queryMovie(searchKey)
  var results = movies.Search
  //  Logger.log(results[0])
  
  var output = []
  
  results.forEach(function(item, index){
    var img = '=image("' + item.Poster + '",4,200,200)'
    output.push([index + 1, item.Title, item.Year, item.imdbID, item.Type, img])
    sheet.setRowHeight(index + 8, 210)
  })
  
  var len = output.length
  
  sheet.getRange(8, 1, 500, 6).clearContent()
  
  sheet.getRange(8, 1, len, 6).setValues(output)
}