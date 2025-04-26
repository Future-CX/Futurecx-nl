const url = window.location.href
let hash = url.substring(url.indexOf('#') + 1)

if (hash === 'success') {
  $('#contactsuccess').toggleClass('d-none')
  $('#contactform').toggleClass('d-none')
}

filterSelection('all')

function filterSelection(c) {
  let x, i
  x = document.getElementsByClassName('filter')
  if (c == 'all') c = ''
  // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], 'show')
    if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], 'show')
  }
}

// Show filtered elements
function w3AddClass(element, name) {
  let i, arr1, arr2
  arr1 = element.className.split(' ')
  arr2 = name.split(' ')
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += ' ' + arr2[i]
    }
  }
}

// Hide elements that are not selected
function w3RemoveClass(element, name) {
  let i, arr1, arr2
  arr1 = element.className.split(' ')
  arr2 = name.split(' ')
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1)
    }
  }
  element.className = arr1.join(' ')
}

// Add active class to the current control button (highlight it)
setActive()
function setActive() {
  let btnContainer = document.getElementById('filtersright')
  if (!btnContainer) return
  let btns = btnContainer.getElementsByClassName('badge')
  for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function () {
      let current = document.getElementsByClassName('selected')
      current[0].className = current[0].className.replace(' selected', '')
      this.className += ' selected'
    })
  }
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
