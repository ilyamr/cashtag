$(document).ready(function () {
  if ($('body.register').length > 0) {
    $('#register-wrapper').show()
    $('#confirm-wrapper').hide()
    $('#success-wrapper').hide()
    $('#register-update').click(function () {
      $('#register-wrapper').show()
      $('#confirm-wrapper').hide()
      $('#success-wrapper').hide()
    })

    if (location.search !== '') {
      var nameVal = location.search
      nameVal = nameVal.substring(nameVal.indexOf('=') + 1)
      $('#register-name-input').val(nameVal)
    }
  }
})

// $('.w-container ').css('max-width', '1115px');

if ($('#login-link').text().length > 20) {
  $('.navigation__menu').hide()
  $('.menu-button')
    .show()
    .children()
    .first()
    .css('color', 'white')
}

function getUserAuthToken () {
  return Object.fromEntries(document.cookie.split('; ').map(x => x.split('=')))
    .Authorization
}

var voteButtonIds = ['submit-vote-1', 'submit-vote-2', 'submit-vote-3']


function assignVoteButtonClickEvents(voteButtonIds) {
  for (let i = 0; i < voteButtonIds.length; i++) {
    $('#' + voteButtonIds[i]).click(function () {
      const authToken = getUserAuthToken()

      let shortCodes = JSON.parse(localStorage.getItem('voteShortCodes'))
      console.log('shortcode saved for vote:')
      console.log(shortCodes[i])

      window.localStorage.setItem('selectedShortCodeForVoting', shortCodes[i])

      switch (authToken) {
        case undefined:
          window.location = '/login-vote'
        default:
          voteForPost(shortCodes[i], true, authToken)
      }
    })
  }
}


$('#register-phone-input').on('input', function (e) {
  if (
    $('#register-phone-input')
      .val()
      .startsWith('+')
  ) {
    $('#register-phone-input').val(
      $('#register-phone-input')
        .val()
        .replace(/[^0-9.\+]/g, '')
        .replace(/(\..*)\./g, '$1')
        .substring(0, 14)
    )
  } else {
    let val = $('#register-phone-input')
      .val()
      .match(/\d/g)
      .join('')

    let arr = [val.substring(0, 3), val.substring(3, 6), val.substring(6, 10)]

    console.log(val.length)

    if (val.length <= 3) {
      $('#register-phone-input').val(`(${arr[0]}`)
    } else if (val.length > 3 && val.length <= 6) {
      $('#register-phone-input').val(`(${arr[0]}) ${arr[1]}`)
    } else if (val.length > 6) {
      $('#register-phone-input').val(`(${arr[0]}) ${arr[1]}-${arr[2]}`)
    }
  }
})

$('#register-age').on('input', function (e) {
  $('#register-age').val(
    $('#register-age')
      .val()
      .replace(/-/, '')
  )
})

$('#register-zip').on('input', function (e) {
  $('#register-zip').val(
    $('#register-zip')
      .val()
      .replace(/-/, '')
  )
})

function showTuneInDate() {

  if(window.localStorage.getItem('tune') && window.localStorage.getItem('tune') !== 'undefined') {
    $('#tune-in-date')
      .find('span')
      .find('.small')
      .text(
        new Date(window.localStorage.getItem('tune')).toString().split('GMT')[0]
      )

    $('#tune-in-date')
      .find('span')
      .find('.small')
      .after('<br>');

      $('#tune-in-date').show(500);
  }
}

showTuneInDate();


function showUserNameInHeader () {
  console.log(window.localStorage.getItem('username'))

  if (
    window.localStorage.getItem('username') !== 'undefined' &&
    window.localStorage.getItem('username') !== null
  ) {
    replaceLink($('#login-link'), window.localStorage.getItem('username'), '#')
    replaceLink($('#register-link'), 'LOG OUT', '#')

    $('#register-link').click(function () {
      window.localStorage.removeItem('username')
      document.cookie =
        'Authorization' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;'

      replaceLink($('#login-link'), 'LOG IN', '/login')
      replaceLink($('#register-link'), 'REGISTER', '/register')
      location.reload(true)
    })
  }
}

showUserNameInHeader()

function replaceLink (jqueryElement, newName, newLink) {
  jqueryElement.fadeOut(100, function () {
    $(this)
      .text(newName)
      .fadeIn(100)
    $(this).attr('href', newLink)
  })
}

$('#deadline').hide()
function getDeadlineDate () {
  $.ajax({
    url:
      'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/contests/end',
    success: function (result) {
      if (result.data) {
        console.log(result.data)
        $('#finish-date')
          .show()
          .text(new Date(result.data).toString().split('GMT')[0])
        $('#deadline').show()
      }
    }
  })
}

getDeadlineDate()

function getDate (authToken) {
  $('.registersuccess__thanks').hide()
  $.ajax({
    url:
      'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/votes/end',
    success: function (result) {
      console.log('result', result)
      if (result.data !== null) {
        $('.registersuccess__thanks').show()
        console.log('vote result data')
        console.log(result.data)

        $('.registersuccess__thanks')
          .last()
          .find('span')
          .find('.small')
          .text(new Date(result.data).toString().split('GMT')[0])

        $('.registersuccess__thanks')
          .last()
          .find('span')
          .find('.small')
          .after('<br>')

        removeVotingLocalStorageData()

        window.localStorage.setItem('tune', result.data)
      } else {
        $('.registersuccess__thanks')
          .last()
          .find('span')
          .find('.small')
          .hide()
      }
    }
  })
}

function voteForPost (shortcode, shouldShowAlerts = false, authToken) {
  console.log('voteForPost authToken')

  console.log('authToken')
  console.log(authToken)

  $.ajax({
    url:
      'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/votes/' +
      shortcode +
      '/vote',
    method: 'POST',
    contentType: 'application/json',
    data: {},
    beforeSend: function (jqXHR) {
      jqXHR.setRequestHeader('Authorization', authToken)
    },
    xhrFields: {
      withCredentials: false
    },
    success: function (result) {
      console.log('result', result)
      if (result.data) {
        console.log('vote result data')
        console.log(result.data.isVotedByUserBefore)
        $('#finish-date')
          .last()
          .find('span')
          .find('.small')
          .text(result.data.contestFinishAt)

        if (result.data.isVotedByUserBefore) {
          $('#success-wrapper')
            .find('.registersuccess__thanks')
            .first()
            .text("You've already voted!")
          $('#success-wrapper')
            .find('.registersuccess__thanks')
            .last()
            .hide()
          //   console.log($(".registersuccess__thanks").first().find('strong'))
          //   $(".registersuccess__thanks").first().find('strong').text("You've already voted!");
          //   $(".registersuccess__thanks").last().hide();
        }

        removeVotingLocalStorageData()

        window.location='/authorized-vote';

      } else {
        shouldShowAlerts ? alert('Voting error!') : null
      }
    }
  })
}

function removeVotingLocalStorageData () {
  window.localStorage.removeItem('voteShortCodes')
  window.localStorage.removeItem('selectedShortCodeForVoting')
}

var Webflow = Webflow || []
Webflow.push(function () {
  $(document).off('submit')

  $('#wf-form-HomeReg').submit(function (evt) {
    evt.preventDefault()
    var name = $('#home-name-input').val()
    location.replace('/register?name=' + name)
  })

  assignVoteButtonClickEvents(voteButtonIds);

  // for (let i = 0; i < voteButtonIds.length; i++) {
  //   $('#' + voteButtonIds[i]).click(function () {
  //     const authToken = getUserAuthToken()

  //     let shortCodes = JSON.parse(localStorage.getItem('voteShortCodes'))
  //     console.log('shortcode saved for vote:')
  //     console.log(shortCodes[i])

  //     window.localStorage.setItem('selectedShortCodeForVoting', shortCodes[i])

  //     switch (authToken) {
  //       case undefined:
  //         window.location = '/login-vote'
  //       default:
  //         voteForPost(shortCodes[i], true, authToken)
  //     }
  //   })
  // }

  $('#wf-form-Login').submit(function (evt) {
    evt.preventDefault()
    $('#register-submit').val('Please wait...')
    $('#register-error')
      .text('')
      .hide()
    var phone = $('#register-phone-input').val()
    window.localStorage.setItem('phone', phone);
    var sendData = {
      phone: phone
    }
    sendData = JSON.stringify(sendData)

    $.ajax({
      url:
        'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/users/login',
      method: 'POST',
      contentType: 'application/json',
      data: sendData,
      success: function (result) {
        if (result.data && result.data.codeSent) {
          $('.register__enter')
            .children('span')
            .first()
            .text(result.data.phone)
          $('#register-wrapper').hide()
          $('#confirm-wrapper').show()
          $('#register-submit').val('Submit')
        }
        if (result.error) {
          console.log(result.message)
          if (result.message.includes('wrong phone')) {
            $('#register-error').text(
              'Wrong phone number, please register by the link below'
            )
          } else {
            $('#register-error').text('There is no account associated with this phone number. Please try again or register below')
          }
          $('#register-error').show()
          $('#register-submit').val('Submit')
        }
      }
    })
  })

  $('#wf-form-Register').submit(function (evt) {
    evt.preventDefault()
    var name = $('#register-name-input').val()
    var phone = $('#register-phone-input').val()
    var age = $('#register-age').val()
    var zip = $('#register-zip').val()
    var firstName = $('#register-firstname').val()
    var lastName = $('#register-lastname').val()
    window.localStorage.setItem('phone', phone);
    var sendData = {
      phone: phone,
      username: name,
      age: age,
      zip: zip,
      firstName: firstName,
      lastName: lastName
    }
    sendData = JSON.stringify(sendData)
    $.ajax({
      url:
        'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/users/signup',
      method: 'POST',
      contentType: 'application/json',
      data: sendData,
      success: function (result) {
        if (result.data && result.data.codeSent) {
          $('#register-wrapper').hide()
          $('#confirm-wrapper').show()
          $('#register-submit').val('Submit')
        }
        if (result.error) {
          $('#register-error').text(result.message)
          $('#register-error').show()
          $('#register-submit').val('Submit')
        }
      }
    })
  })

  $('#wf-form-register-Confirm').submit(function (evt) {
    evt.preventDefault()
    $('#confirm-submit').val('Please wait...')
    $('#confirm-error')
      .text('')
      .hide()
    var name = $('#register-name-input').val()
    var code = $('#register-code-input').val()
    var phone = $('#register-phone-input').val()
    window.localStorage.setItem('phone', phone);
    var sendData = {
      phone: phone,
      code: code
    }
    sendData = JSON.stringify(sendData)
    $.ajax({
      url:
        'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/users/signup/verify',
      method: 'POST',
      contentType: 'application/json',
      data: sendData,
      success: function (result) {
        if (result.data && result.data.user.verified) {
          document.cookie =
            'Authorization=JWT ' +
            result.data.access_token +
            ';expires=Mon, 01 Jan 2035 00:00:00 GMT"'

          if (result.data.user.username !== 'undefined') {
            window.localStorage.setItem('username', result.data.user.username)
          }

          if (
            window.localStorage.getItem('selectedShortCodeForVoting') !== null
          ) {
            voteForPost(
              window.localStorage.getItem('selectedShortCodeForVoting'),
              false,
              'JWT ' + result.data.access_token
            )

            getDate(result.data.access_token)
            removeVotingLocalStorageData()
          }

          showUserNameInHeader()

          $('#register-wrapper').hide()
          $('#confirm-wrapper').hide()
          if (result.data.user.firstName !== undefined) {
            $('#registered-name').text(result.data.user.firstName)
          }
          $('#success-wrapper').show()
          $('#confirm-submit').val('Confirm')
        } else if (result.data && !result.data.user.verified) {
          $('#confirm-error').text('you did not pass the verification')
          $('#confirm-error').show()
          $('#confirm-submit').val('Confirm')
        }
        if (result.error) {
          $('#confirm-error').text(result.message)
          $('#confirm-error').show()
          $('#confirm-submit').val('Confirm')
        }
      }
    })
  })

  $('#wf-form-Confirm').submit(function (evt) {
    evt.preventDefault()
    $('#confirm-submit').val('Please wait...')
    $('#confirm-error')
      .text('')
      .hide()
    var name = $('#register-name-input').val()
    var code = $('#register-code-input').val()
    var phone = $('#register-phone-input').val()
    window.localStorage.setItem('phone', phone);
    var sendData = {
      phone: phone,
      code: code
    }
    sendData = JSON.stringify(sendData)
    $.ajax({
      url:
        'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/users/login/verify',
      method: 'POST',
      contentType: 'application/json',
      data: sendData,
      success: function (result) {
        if (result.data && result.data.access_token) {
          document.cookie =
            'Authorization=JWT ' +
            result.data.access_token +
            ';expires=Mon, 01 Jan 2035 00:00:00 GMT"'

          if (result.data.user.username !== 'undefined') {
            window.localStorage.setItem('username', result.data.user.username)
          }

          if (
            window.localStorage.getItem('selectedShortCodeForVoting') !== null
          ) {
            voteForPost(
              window.localStorage.getItem('selectedShortCodeForVoting'),
              false,
              'JWT ' + result.data.access_token
            )

            getDate(result.data.access_token)
            removeVotingLocalStorageData()
          }

          showUserNameInHeader()

          $('#register-wrapper').hide()
          $('#confirm-wrapper').hide()
          if (result.data.user.firstName !== undefined) {
            $('#registered-name').text(result.data.user.firstName)
          }
          $('#success-wrapper').show()
          $('#confirm-submit').val('Confirm')
        } else if (result.data && !result.data.user.verified) {
          $('#confirm-error').text('you did not pass the verification')
          $('#confirm-error').show()
          $('#confirm-submit').val('Confirm')
        }
        if (result.error) {
          $('#confirm-error').text(result.message)
          $('#confirm-error').show()
          $('#confirm-submit').val('Confirm')
        }
      }
    })
  })

  $('#register-resend').click(function () {
    $('#confirm-error')
      .text('')
      .hide()
    var name = $('#register-name-input').val()
    var phone = window.localStorage.getItem('phone');
    console.log(phone)
    var age = $('#register-age').val()
    var zip = $('#register-zip').val()
    var firstName = $('#register-firstname').val()
    var lastName = $('#register-lastname').val()
    var sendData = {
      phone: phone,
      username: name,
      age: age,
      zip: zip,
      firstName: firstName,
      lastName: lastName
    }
    let urlPage = window.location.href.includes("register") ? 'signup' : 'login'
    sendData = JSON.stringify(sendData)
    $.ajax({
      url:
        'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/users/' + urlPage,
      method: 'POST',
      contentType: 'application/json',
      data: sendData,
      success: function (result) {
        if (result.data && result.data.codeSent) {
          alert('sent a new code')
        }
        if (result.error) {
          $('#confirm-error').text(result.message)
          $('#confirm-error').show()
        }
      }
    })
  })
})

$(document).ready(function () {
  function startTimer () {
    var getVal = $('#hidden-time').text()

    if (getVal.length > 0) {
      var countDownDate = new Date(getVal).getTime()
      var x = setInterval(function () {
        var now = new Date().getTime()
        var distance = countDownDate - now
        // var hours = parseInt((distance / (1000 * 60 * 60)) % 24)
        var hours = parseInt(distance / (1000 * 60 * 60))
        if (hours < 10) {
          hours = '0' + hours
        }
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        if (minutes < 10) {
          minutes = '0' + minutes
        }
        var seconds = Math.floor((distance % (1000 * 60)) / 1000)
        if (seconds < 10) {
          seconds = '0' + seconds
        }

        if (document.getElementById('time')) {
          document.getElementById('time').innerHTML =
            hours + ':' + minutes + ':' + seconds
          if (distance < 0) {
            clearInterval(x)
            document.getElementById('time').innerHTML = '00:00:00'
          }
        }
      }, 1000)
    }
  }

  if ($('body.ranking-page').length > 0) {
    function getQuery (q) {
      var query = window.location.search.substring(1)
      var vars = query.split('&')
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=')
        if (pair[0] == q) {
          return pair[1]
        }
      }
      return false
    }
    var key = getQuery('key')
    var tag = getQuery('hashtag')
    $.ajax({
      url:
        'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/stats/' +
        tag +
        '/' +
        key,
      success: function (result) {
        var data = result.data
        var finished = data.finishAt
        $('#hidden-time').text(finished)
        startTimer()
        var winners = data.winners
        var prize = data.prize
        var rank = data.rank
        var tag = data.post.hashtag
        var dataDesc = data.post.description
        var description = $($.parseHTML(dataDesc)).text()
        var url = data.post.post_url
        var avatar = data.profile_pic_url
        if (data.post.likes) {
          var likes = data.post.likes + ' likes'
        } else {
          var likes = '0 likes'
        }
        var photo = data.post.display_url
        var photo2 = data.post.photo_link_640x640
        var username = data.username
        $('#ranking-tag').text(tag)
        $('#ranking-rank').text(rank)
        $('#ranking-winners').text(winners)
        $('#ranking-prize').text('$' + prize)
        $('.ranking__post').append(
          '<a class="userpost" href="' +
            url +
            '" target="_blank"><div class="userpost__top"><div class="userpost__avatar" style="background-image: url(' +
            photo +
            ');"></div><div class="userpost__name" style="font-weight: 700">' +
            username +
            '</div><img src="https://uploads-ssl.webflow.com/5c5ac1c89abbac627723a069/5c6923af80da2a82526caa25_instagram%20icon.png" alt="" class="userpost__icon" /></div><div class="userpost__image" style="background-image: url(' +
            photo +
            '), url(' +
            photo2 +
            ');background-size: cover;background-position: center;"></div><div class="userpost__bottom"><div class="userpost__likes" style="font-weight: 700"><div class="userpost__likes-count">' +
            likes +
            '</div></div><div class="userpost__desc"><div class="userpost__desc-name" style="font-weight: 700">' +
            username +
            '</div><div class="userpost__desc-text">' +
            description +
            '</div></div></div></a>'
        )
        setTimeout(function () {
          $('.ranking__loader').hide()
          $('.ranking__wrapper').show()
        }, 1000)
      }
    })
  }

  if ($('body.index-page').length > 0) {
    $.ajax({
      url:
        'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/contests/active',
      success: function (result) {
        let response = result.data
        response.sort((a, b) =>
          a.finishAt < b.finishAt ? 1 : b.finishAt < a.finishAt ? -1 : 0
        )
        if (response[0] && response[0].finishAt) {
          $('#hidden-time').text(response[0].finishAt)
          startTimer()
        }
      }
    })

    var votesShortcode = ''
    function getVotePosts () {
      $.ajax({
        url:
          'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/votes',
        headers: { Authorization: getUserAuthToken() },
        success: function (result) {
          var votePosts = result.data.posts

          let voted = false
          for (let i = 0; i < votePosts.length; i++) {
            if (votePosts[i].isVotedByUser === true) {
              voted = true
            }
          }

          if (!voted) {
            for (let i = 0; i < voteButtonIds.length; i++) {
              $('#' + voteButtonIds[i]).show(500)
            }
          }

          if (votePosts.length > 0) {
            try {
              window.localStorage.setItem(
                'voteShortCodes',
                JSON.stringify(votePosts.map(x => x.shortcode))
              )
            } catch (error) {
              console.log(error)
            }

            $('#votes-tag-top .loadingposts').remove()
            function showTopPosts () {
              $.each(votePosts, function (i, e) {
                var description = $($.parseHTML(votePosts[i].description))
                  .text()
                  .split(' ')
                  .map(word => {
                    if (word.startsWith('#')) {
                      return `<span style="color: blue">${word}</span>`
                    }
                    return word
                  })
                  .join(' ')
                if (votePosts[i].likes) {
                  var likes = votePosts[i].likes + ' likes'
                } else {
                  var likes = '0 likes'
                }
                var photo = votePosts[i].display_url
                var photo2 = votePosts[i].photo_link_640x640
                var url = votePosts[i].post_url
                if (votePosts[i].username) {
                  var username = votePosts[i].username
                } else {
                  var username = ''
                }
                if (votePosts[i].profile_pic_url) {
                  var avatar = votePosts[i].profile_pic_url
                } else {
                  var avatar =
                    'https://uploads-ssl.webflow.com/5c5ac1c89abbac627723a069/5c6fd9796978d23bee8b4216_avatar_und.jpg'
                }
                $('#votes-tag-top').css({
                  display: 'flex',
                  'flex-wrap': 'wrap',
                  'justify-content': 'space-around'
                })
                $('#votes-tag-top').append(
                  '<div class="card-container" style="display:flex;flex-direction:column;align-items:center;margin-bottom:24px;"><a class="instacard" href="' +
                    url +
                    '" target="_blank"><div class="instacard__top" style="display: flex; justify-content: space-between"><div style="display: flex;align-items: center;"><div class="instacard__avatar" style="background-image: url(' +
                    avatar +
                    ')"></div><div class="instacard__name">' +
                    username +
                    '</div></div><img src="https://svgshare.com/i/FU3.svg" class="instacard__icon" style="width: 20px;margin: 0 5px ;"></div><div class="instacard__image" style="background-image: url(' +
                    photo +
                    '), url(' +
                    photo2 +
                    ');"></div><div class="instacard__bottom" style="padding: 10px 8px 16px; height: auto"><div style="display: flex; justify-content: space-between"><div style="display: flex; margin-bottom: 5px;"><img src="https://svgshare.com/i/FTb.svg" style="height: 20px;margin:0 5px;"><img src="https://svgshare.com/i/FSN.svg" style="width: 20px;margin: 0 5px;"><img src="https://svgshare.com/i/FT3.svg" style="height: 20px;margin:0 5px;"></div><img src="https://svgshare.com/i/FTi.svg" style="height: 20px;margin:0 5px;"></div><div class="instacard__likes"><div class="instacard__likes-count">' +
                    likes +
                    '</div></div></div></a>' +
                    `<a href='#' class='winform__submit winform__submitvote w-button' id=submit-vote-${++i}>SUBMIT MY VOTE</a>` +
                    '</div>'
                )
              })
            }
            showTopPosts()


            if (!voted) {
              for (let i = 0; i < voteButtonIds.length; i++) {
                $('#' + voteButtonIds[i]).show(500)
              }
            } else {
              for (let i = 0; i < voteButtonIds.length; i++) {
                $('#' + voteButtonIds[i]).hide()
              }
            }

            assignVoteButtonClickEvents(voteButtonIds);
          }
        }
      })
    }

    getVotePosts()

    var firstTag = $('#first-title-tag').text()
    var last_likes1 = ''
    var last_shortcode1 = ''
    function getTopPosts () {
      $.ajax({
        url:
          'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/posts/' +
          firstTag +
          '/top?last_likes=' +
          last_likes1 +
          '&last_shortcode=' +
          last_shortcode1,
        success: function (result) {
          firstTopResult = result.data
          if (firstTopResult.length > 0) {
            var last = result.last
            last_likes1 = last.likes
            last_shortcode1 = last.shortcode
            $('#first-tag-top .loadingposts').remove()
            $('#first-top-show-more').text('Show More')
            function showTopPosts () {
              $.each(firstTopResult, function (i, e) {
                var description = $($.parseHTML(firstTopResult[i].description))
                  .text()
                  .split(' ')
                  .map(word => {
                    if (word.startsWith('#')) {
                      return `<span style="color: blue">${word}</span>`
                    }
                    return word
                  })
                  .join(' ')
                if (firstTopResult[i].likes) {
                  var likes = firstTopResult[i].likes + ' likes'
                } else {
                  var likes = '0 likes'
                }
                var photo = firstTopResult[i].display_url
                var photo2 = firstTopResult[i].photo_link_640x640
                var url = firstTopResult[i].post_url
                if (firstTopResult[i].username) {
                  var username = firstTopResult[i].username
                } else {
                  var username = ''
                }
                if (firstTopResult[i].profile_pic_url) {
                  var avatar = firstTopResult[i].profile_pic_url
                } else {
                  var avatar =
                    'https://uploads-ssl.webflow.com/5c5ac1c89abbac627723a069/5c6fd9796978d23bee8b4216_avatar_und.jpg'
                }
                $('#first-tag-top').append(
                  '<a class="instacard" href="' +
                    url +
                    '" target="_blank"><div class="instacard__top" style="display: flex; justify-content: space-between"><div style="display: flex;align-items: center;"><div class="instacard__avatar" style="background-image: url(' +
                    avatar +
                    ')"></div><div class="instacard__name">' +
                    username +
                    '</div></div><img src="https://svgshare.com/i/FU3.svg" class="instacard__icon" style="width: 20px;margin: 0 5px ;"></div><div class="instacard__image" style="background-image: url(' +
                    photo +
                    '), url(' +
                    photo2 +
                    ');"></div><div class="instacard__bottom" style="padding: 10px 8px 16px; height: auto""><div style="display: flex; justify-content: space-between"><div style="display: flex; margin-bottom: 5px;"><img src="https://svgshare.com/i/FTb.svg" style="height: 20px;margin:0 5px;"><img src="https://svgshare.com/i/FSN.svg" style="width: 20px;margin: 0 5px;"><img src="https://svgshare.com/i/FT3.svg" style="height: 20px;margin:0 5px;"></div><img src="https://svgshare.com/i/FTi.svg" style="height: 20px;margin:0 5px;"></div><div class="instacard__likes"><div class="instacard__likes-count">' +
                    likes +
                    '</div></div></div></a>'
                )
              })
            }
            showTopPosts()
          } else {
            $('#first-top-show-more').css({
              border: 'none',
              width: '150px',
              pointerEvents: 'none'
            })
            $('#first-top-show-more').text('All For Now')
          }
        }
      })
    }

    getTopPosts()
    $('#first-top-show-more').click(function () {
      $('#first-top-show-more').text('Loading...')
      getTopPosts()
    })

    var last_time1 = ''
    var last_shortcode11 = ''
    function getRecentPosts () {
      $.ajax({
        url:
          'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/posts/' +
          firstTag +
          '/fresh?last_photo_timestamp=' +
          last_time1 +
          '&last_shortcode=' +
          last_shortcode11,
        success: function (result) {
          firstRecentResult = result.data
          if (firstRecentResult.length > 0) {
            var last = result.last
            last_time1 = last.photo_timestamp
            last_shortcode11 = last.shortcode
            $('#first-tag-recent .loadingposts').remove()
            $('#first-recent-show-more').text('Show More')
            function showRecentPosts () {
              const btns = $('.div-block-3').children()
              console.log(btns)
              $.each(firstRecentResult, function (i, e) {
                var description = $(
                  $.parseHTML(firstRecentResult[i].description)
                )
                  .text()
                  .split(' ')
                  .map(word => {
                    if (word.startsWith('#')) {
                      return `<span style="color: blue">${word}</span>`
                    }
                    return word
                  })
                  .join(' ')
                if (firstRecentResult[i].likes) {
                  var likes = firstRecentResult[i].likes + ' likes'
                } else {
                  var likes = '0 likes'
                }
                var photo = firstRecentResult[i].display_url
                var photo2 = firstRecentResult[i].photo_link_640x640
                var url = firstRecentResult[i].post_url
                if (firstRecentResult[i].username) {
                  var username = firstRecentResult[i].username
                } else {
                  var username = ''
                }
                if (firstRecentResult[i].profile_pic_url) {
                  var avatar = firstRecentResult[i].profile_pic_url
                } else {
                  var avatar =
                    'https://uploads-ssl.webflow.com/5c5ac1c89abbac627723a069/5c6fd9796978d23bee8b4216_avatar_und.jpg'
                }
                $('#first-tag-recent').append(
                  '<a class="instacard" href="' +
                    url +
                    '" target="_blank"><div class="instacard__top" style="display: flex; justify-content: space-between"><div style="display: flex;align-items: center;"><div class="instacard__avatar" style="background-image: url(' +
                    avatar +
                    ')"></div><div class="instacard__name">' +
                    username +
                    '</div></div><img src="https://svgshare.com/i/FU3.svg" class="instacard__icon" style="width: 20px;margin: 0 5px ;"></div><div class="instacard__image" style="background-image: url(' +
                    photo +
                    '), url(' +
                    photo2 +
                    ');"></div><div class="instacard__bottom" style="padding: 10px 8px 16px; height: auto""><div style="display: flex; justify-content: space-between"><div style="display: flex; margin-bottom: 5px;"><img src="https://svgshare.com/i/FTb.svg" style="height: 20px;margin:0 5px;"><img src="https://svgshare.com/i/FSN.svg" style="width: 20px;margin: 0 5px;"><img src="https://svgshare.com/i/FT3.svg" style="height: 20px;margin:0 5px;"></div><img src="https://svgshare.com/i/FTi.svg" style="height: 20px;margin:0 5px;"></div><div class="instacard__likes"><div class="instacard__likes-count">' +
                    likes +
                    '</div></div></div></a>'
                )
              })
            }
            showRecentPosts()
          } else {
            $('#first-recent-show-more').css({
              border: 'none',
              width: '150px',
              pointerEvents: 'none'
            })
            $('#first-recent-show-more').text('All For Now')
          }
        }
      })
    }
    getRecentPosts()
    $('#first-recent-show-more').click(function () {
      $('#first-recent-show-more').text('Loading...')
      getRecentPosts()
    })
  }

  if ($('body.index-page').length > 0) {
    var secondTag = $('#second-title-tag').text()
    var last_likes2 = ''
    var last_shortcode2 = ''
    function getTopPosts () {
      $.ajax({
        url:
          'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/posts/' +
          secondTag +
          '/top?last_likes=' +
          last_likes2 +
          '&last_shortcode=' +
          last_shortcode2,
        success: function (result) {
          secondTopResult = result.data
          if (secondTopResult.length > 0) {
            var last = result.last
            last_likes2 = last.likes
            last_shortcode2 = last.shortcode
            $('#second-tag-top .loadingposts').remove()
            $('#second-top-show-more').text('Show More')
            function showTopPosts () {
              $.each(secondTopResult, function (i, e) {
                var description = $($.parseHTML(secondTopResult[i].description))
                  .text()
                  .split(' ')
                  .map(word => {
                    if (word.startsWith('#')) {
                      return `<span style="color: blue">${word}</span>`
                    }
                    return word
                  })
                  .join(' ')
                if (secondTopResult[i].likes) {
                  var likes = secondTopResult[i].likes + ' likes'
                } else {
                  var likes = '0 likes'
                }
                var photo = secondTopResult[i].display_url
                var photo2 = secondTopResult[i].photo_link_640x640
                var url = secondTopResult[i].post_url
                if (secondTopResult[i].username) {
                  var username = secondTopResult[i].username
                } else {
                  var username = ''
                }
                if (secondTopResult[i].profile_pic_url) {
                  var avatar = secondTopResult[i].profile_pic_url
                } else {
                  var avatar =
                    'https://uploads-ssl.webflow.com/5c5ac1c89abbac627723a069/5c6fd9796978d23bee8b4216_avatar_und.jpg'
                }
                $('#second-tag-top').append(
                  '<a class="instacard" href="' +
                    url +
                    '" target="_blank"><div class="instacard__top" style="display: flex; justify-content: space-between"><div style="display: flex;align-items: center;"><div class="instacard__avatar" style="background-image: url(' +
                    avatar +
                    ')"></div><div class="instacard__name">' +
                    username +
                    '</div></div><img src="https://svgshare.com/i/FU3.svg" class="instacard__icon" style="width: 20px;margin: 0 5px ;"></div><div class="instacard__image" style="background-image: url(' +
                    photo +
                    '), url(' +
                    photo2 +
                    ');"></div><div class="instacard__bottom" style="padding: 10px 8px 16px; height: auto""><div style="display: flex; justify-content: space-between"><div style="display: flex; margin-bottom: 5px;"><img src="https://svgshare.com/i/FTb.svg" style="height: 20px;margin:0 5px;"><img src="https://svgshare.com/i/FSN.svg" style="width: 20px;margin: 0 5px;"><img src="https://svgshare.com/i/FT3.svg" style="height: 20px;margin:0 5px;"></div><img src="https://svgshare.com/i/FTi.svg" style="height: 20px;margin:0 5px;"></div><div class="instacard__likes"><div class="instacard__likes-count">' +
                    likes +
                    '</div></div></div></a>'
                )
              })
            }
            showTopPosts()
          } else {
            $('#second-top-show-more').css({
              border: 'none',
              width: '150px',
              pointerEvents: 'none'
            })
            $('#second-top-show-more').text('All For Now')
          }
        }
      })
    }
    getTopPosts()
    $('#second-top-show-more').click(function () {
      $('#second-top-show-more').text('Loading...')
      getTopPosts()
    })

    var last_time2 = ''
    var last_shortcode22 = ''
    function getRecentPosts () {
      $.ajax({
        url:
          'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/posts/' +
          secondTag +
          '/fresh?last_photo_timestamp=' +
          last_time2 +
          '&last_shortcode=' +
          last_shortcode22,
        success: function (result) {
          secondRecentResult = result.data
          if (secondRecentResult.length > 0) {
            var last = result.last
            last_time2 = last.photo_timestamp
            last_shortcode22 = last.shortcode
            $('#second-tag-recent .loadingposts').remove()
            $('#second-recent-show-more').text('Show More')
            function showRecentPosts () {
              $.each(secondRecentResult, function (i, e) {
                var description = $(
                  $.parseHTML(secondRecentResult[i].description)
                )
                  .text()
                  .split(' ')
                  .map(word => {
                    if (word.startsWith('#')) {
                      return `<span style="color: blue">${word}</span>`
                    }
                    return word
                  })
                  .join(' ')
                if (secondRecentResult[i].likes) {
                  var likes = secondRecentResult[i].likes + ' likes'
                } else {
                  var likes = '0 likes'
                }
                var photo = secondRecentResult[i].display_url
                var photo2 = secondRecentResult[i].photo_link_640x640
                var url = secondRecentResult[i].post_url
                if (secondRecentResult[i].username) {
                  var username = secondRecentResult[i].username
                } else {
                  var username = ''
                }
                if (secondRecentResult[i].profile_pic_url) {
                  var avatar = secondRecentResult[i].profile_pic_url
                } else {
                  var avatar =
                    'https://uploads-ssl.webflow.com/5c5ac1c89abbac627723a069/5c6fd9796978d23bee8b4216_avatar_und.jpg'
                }
                $('#second-tag-recent').append(
                  '<a class="instacard" href="' +
                    url +
                    '" target="_blank"><div class="instacard__top" style="display: flex; justify-content: space-between"><div style="display: flex;align-items: center;"><div class="instacard__avatar" style="background-image: url(' +
                    avatar +
                    ')"></div><div class="instacard__name">' +
                    username +
                    '</div></div><img src="https://svgshare.com/i/FU3.svg" class="instacard__icon" style="width: 20px;margin: 0 5px ;"></div><div class="instacard__image" style="background-image: url(' +
                    photo +
                    '), url(' +
                    photo2 +
                    ');"></div><div class="instacard__bottom" style="padding: 10px 8px 16px; height: auto""><div style="display: flex; justify-content: space-between"><div style="display: flex; margin-bottom: 5px;"><img src="https://svgshare.com/i/FTb.svg" style="height: 20px;margin:0 5px;"><img src="https://svgshare.com/i/FSN.svg" style="width: 20px;margin: 0 5px;"><img src="https://svgshare.com/i/FT3.svg" style="height: 20px;margin:0 5px;"></div><img src="https://svgshare.com/i/FTi.svg" style="height: 20px;margin:0 5px;"></div><div class="instacard__likes"><div class="instacard__likes-count">' +
                    likes +
                    '</div></div></div></a>'
                )
              })
            }
            showRecentPosts()
          } else {
            $('#second-recent-show-more').css({
              border: 'none',
              width: '150px',
              pointerEvents: 'none'
            })
            $('#second-recent-show-more').text('All For Now')
          }
        }
      })
    }
    getRecentPosts()
    $('#second-recent-show-more').click(function () {
      $('#second-recent-show-more').text('Loading...')
      getRecentPosts()
    })
  }

  if ($('body.index-page').length > 0) {
    var thirdTag = $('#third-title-tag').text()
    var last_likes3 = ''
    var last_shortcode3 = ''
    function getTopPosts () {
      $.ajax({
        url:
          'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/posts/' +
          thirdTag +
          '/top?last_likes=' +
          last_likes3 +
          '&last_shortcode=' +
          last_shortcode3,
        success: function (result) {
          thirdTopResult = result.data
          if (thirdTopResult.length > 0) {
            var last = result.last
            last_likes3 = last.likes
            last_shortcode3 = last.shortcode
            $('#third-tag-top .loadingposts').remove()
            $('#third-top-show-more').text('Show More')
            function showTopPosts () {
              $.each(thirdTopResult, function (i, e) {
                var description = $($.parseHTML(thirdTopResult[i].description))
                  .text()
                  .split(' ')
                  .map(word => {
                    if (word.startsWith('#')) {
                      return `<span style="color: blue">${word}</span>`
                    }
                    return word
                  })
                  .join(' ')
                if (thirdTopResult[i].likes) {
                  var likes = thirdTopResult[i].likes + ' likes'
                } else {
                  var likes = '0 likes'
                }
                var photo = thirdTopResult[i].display_url
                var photo2 = thirdTopResult[i].photo_link_640x640
                var url = thirdTopResult[i].post_url
                if (thirdTopResult[i].username) {
                  var username = thirdTopResult[i].username
                } else {
                  var username = ''
                }
                if (thirdTopResult[i].profile_pic_url) {
                  var avatar = thirdTopResult[i].profile_pic_url
                } else {
                  var avatar =
                    'https://uploads-ssl.webflow.com/5c5ac1c89abbac627723a069/5c6fd9796978d23bee8b4216_avatar_und.jpg'
                }
                $('#third-tag-top').append(
                  '<a class="instacard" href="' +
                    url +
                    '" target="_blank"><div class="instacard__top" style="display: flex; justify-content: space-between"><div style="display: flex;align-items: center;"><div class="instacard__avatar" style="background-image: url(' +
                    avatar +
                    ')"></div><div class="instacard__name">' +
                    username +
                    '</div></div><img src="https://svgshare.com/i/FU3.svg" class="instacard__icon" style="width: 20px;margin: 0 5px ;"></div><div class="instacard__image" style="background-image: url(' +
                    photo +
                    '), url(' +
                    photo2 +
                    ');"></div><div class="instacard__bottom" style="padding: 10px 8px 16px; height: auto""><div style="display: flex; justify-content: space-between"><div style="display: flex; margin-bottom: 5px;"><img src="https://svgshare.com/i/FTb.svg" style="height: 20px;margin:0 5px;"><img src="https://svgshare.com/i/FSN.svg" style="width: 20px;margin: 0 5px;"><img src="https://svgshare.com/i/FT3.svg" style="height: 20px;margin:0 5px;"></div><img src="https://svgshare.com/i/FTi.svg" style="height: 20px;margin:0 5px;"></div><div class="instacard__likes"><div class="instacard__likes-count">' +
                    likes +
                    '</div></div></div></a>'
                )
              })
            }
            showTopPosts()
          } else {
            $('#third-top-show-more').css({
              border: 'none',
              width: '150px',
              pointerEvents: 'none'
            })
            $('#third-top-show-more').text('All For Now')
          }
        }
      })
    }
    getTopPosts()
    $('#third-top-show-more').click(function () {
      $('#third-top-show-more').text('Loading...')
      getTopPosts()
    })

    var last_time3 = ''
    var last_shortcode33 = ''
    function getRecentPosts () {
      $.ajax({
        url:
          'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/posts/' +
          thirdTag +
          '/fresh?last_photo_timestamp=' +
          last_time3 +
          '&last_shortcode=' +
          last_shortcode33,
        success: function (result) {
          thirdRecentResult = result.data
          if (thirdRecentResult.length > 0) {
            var last = result.last
            last_time3 = last.photo_timestamp
            last_shortcode33 = last.shortcode
            $('#third-tag-recent .loadingposts').remove()
            $('#third-recent-show-more').text('Show More')
            function showRecentPosts () {
              $.each(thirdRecentResult, function (i, e) {
                var description = $(
                  $.parseHTML(thirdRecentResult[i].description)
                )
                  .text()
                  .split(' ')
                  .map(word => {
                    if (word.startsWith('#')) {
                      return `<span style="color: blue">${word}</span>`
                    }
                    return word
                  })
                  .join(' ')
                if (thirdRecentResult[i].likes) {
                  var likes = thirdRecentResult[i].likes + ' likes'
                } else {
                  var likes = '0 likes'
                }
                var photo = thirdRecentResult[i].display_url
                var photo2 = thirdRecentResult[i].photo_link_640x640
                var url = thirdRecentResult[i].post_url
                if (thirdRecentResult[i].username) {
                  var username = thirdRecentResult[i].username
                } else {
                  var username = ''
                }
                if (thirdRecentResult[i].profile_pic_url) {
                  var avatar = thirdRecentResult[i].profile_pic_url
                } else {
                  var avatar =
                    'https://uploads-ssl.webflow.com/5c5ac1c89abbac627723a069/5c6fd9796978d23bee8b4216_avatar_und.jpg'
                }
                $('#third-tag-recent').append(
                  '<a class="instacard" href="' +
                    url +
                    '" target="_blank"><div class="instacard__top" style="display: flex; justify-content: space-between"><div style="display: flex;align-items: center;"><div class="instacard__avatar" style="background-image: url(' +
                    avatar +
                    ')"></div><div class="instacard__name">' +
                    username +
                    '</div></div><img src="https://svgshare.com/i/FU3.svg" class="instacard__icon" style="width: 20px;margin: 0 5px ;"></div><div class="instacard__image" style="background-image: url(' +
                    photo +
                    '), url(' +
                    photo2 +
                    ');"></div><div class="instacard__bottom" style="padding: 10px 8px 16px; height: auto""><div style="display: flex; justify-content: space-between"><div style="display: flex; margin-bottom: 5px;"><img src="https://svgshare.com/i/FTb.svg" style="height: 20px;margin:0 5px;"><img src="https://svgshare.com/i/FSN.svg" style="width: 20px;margin: 0 5px;"><img src="https://svgshare.com/i/FT3.svg" style="height: 20px;margin:0 5px;"></div><img src="https://svgshare.com/i/FTi.svg" style="height: 20px;margin:0 5px;"></div><div class="instacard__likes"><div class="instacard__likes-count">' +
                    likes +
                    '</div></div></div></a>'
                )
              })
            }
            showRecentPosts()
          } else {
            $('#third-recent-show-more').css({
              border: 'none',
              width: '150px',
              pointerEvents: 'none'
            })
            $('#third-recent-show-more').text('All For Now')
          }
        }
      })
    }
    getRecentPosts()
    $('#third-recent-show-more').click(function () {
      $('#third-recent-show-more').text('Loading...')
      getRecentPosts()
    })
  }
})
