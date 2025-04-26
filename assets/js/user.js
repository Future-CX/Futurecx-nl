const url = window.location.href
let hash = url.substring(url.indexOf('#') + 1)

if (hash === 'success') {
  $('#contactsuccess').toggleClass('d-none')
  $('#contactform').toggleClass('d-none')
}

// Copyright
let year = new Date().getFullYear()
document.getElementById('copyright').innerHTML =
  '© ' + year + ' Future CX by Martijn van Deel'

$(document).ready(function () {
  // set the all columns to the height of the tallest column by using a function
  let equalHeight = function () {
    //  the height of each column is reset to default calculated by browser
    $('.clients-grid-item article').css('height', 'auto')
    let maxHeight = 0
    // get the maximum height
    $('.clients-grid-item article').each(function () {
      if ($(this).height() > maxHeight) {
        maxHeight = $(this).height()
      }
    })
    // the maximum height is set to each height of column
    $('.clients-grid-item article').css('height', maxHeight)
  }
  //  equal height set on page load
  equalHeight()
  // equal height set when the container of these columns is resized
  $('.my-shuffle').resize(function () {
    equalHeight()
  })
})
