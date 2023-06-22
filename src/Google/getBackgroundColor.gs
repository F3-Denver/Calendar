function doGet() {
  var sheet = SpreadsheetApp.getActive().getSheetByName("Categories")
  
  var rows = sheet.getLastRow()

  var categories = []

  for (var i = 2; i <= rows; i++) {
    var category = {}
    var categoryName = sheet.getRange(i, 1).getValue().toString()
    var backgroundColor = sheet.getRange(i, 2).getBackground()

    category["Name"] = categoryName
    category["Color"] = backgroundColor

    categories.push(category)
  }

  return ContentService.createTextOutput(JSON.stringify(categories)) 
}