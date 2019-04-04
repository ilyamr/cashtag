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
      nameVal = nameVal.substring(nameVal.indexOf('=')+1)
      $('#register-name-input').val(nameVal)
    }
  }
})

var Webflow = Webflow || []
Webflow.push(function () {
  $(document).off('submit')
  
  $('#wf-form-HomeReg').submit(function (evt) {
    evt.preventDefault()
    var name = $('#home-name-input').val()
    location.replace("/register?name=" + name)
  })

  $('#wf-form-Register').submit(function (evt) {
    evt.preventDefault()
    $('#register-submit').val('Please wait...')
    $('#register-error').text('').hide()
    var name = $('#register-name-input').val()
    var phone = $('#register-phone-input').val()
    var sendData = {
      phone: phone,
      username: name
    }
    sendData = JSON.stringify(sendData)
    $.ajax({
      url: 'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/users/signup',
      method: 'POST',
      dataType:'JSON',
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

  $('#wf-form-Confirm').submit(function (evt) {
    evt.preventDefault()
    $('#confirm-submit').val('Please wait...')
    $('#confirm-error').text('').hide()
    var name = $('#register-name-input').val()
    var code = $('#register-code-input').val()
    var phone = $('#register-phone-input').val()
    var sendData = {
      phone: phone,
      code: code
    }
    sendData = JSON.stringify(sendData)
    $.ajax({
      url: 'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/users/verify',
      method: 'POST',
      dataType:'JSON',
      data: sendData,
      success: function (result) {
        if (result.data && result.data.verified) {
          $('#register-wrapper').hide()
          $('#confirm-wrapper').hide()
          $('#registered-name').text(name)
          $('#success-wrapper').show()
          $('#confirm-submit').val('Confirm')
        } else if (result.data && !result.data.verified) {
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
    $('#confirm-error').text('').hide()
    var name = $('#register-name-input').val()
    var phone = $('#register-phone-input').val()
    var sendData = {
      phone: phone,
      username: name
    }
    sendData = JSON.stringify(sendData)
    $.ajax({
      url: 'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/users/signup',
      method: 'POST',
      dataType:'JSON',
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
  function startTimer() {
    var getVal = $('#hidden-time').text()
    var countDownDate = new Date(getVal).getTime()
    var x = setInterval(function () {
      var now = new Date().getTime()
      var distance = countDownDate - now
      // var hours = parseInt((distance / (1000 * 60 * 60)) % 24)
      var hours = parseInt((distance / (1000 * 60 * 60)))
      if (hours < 10) { hours = '0' + hours }
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      if (minutes < 10) { minutes = '0' + minutes }
      var seconds = Math.floor((distance % (1000 * 60)) / 1000)
      if (seconds < 10) { seconds = '0' + seconds }
      document.getElementById('time').innerHTML = hours + ':' + minutes + ':' + seconds
      if (distance < 0) {
        clearInterval(x)
        document.getElementById('time').innerHTML = '00:00:00'
      }
    }, 1000)
  }

  if ($('body.ranking-page').length > 0) {   
    function getQuery(q) {
      var query = window.location.search.substring(1)
      var vars = query.split("&")
      for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=")
        if(pair[0] == q){return pair[1]}
      }
      return(false)
    }
    var key = getQuery("key")
    var tag = getQuery("hashtag")
    $.ajax({
      url: 'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/stats/' + tag + '/' + key,
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
        $('.ranking__post').append('<a class="userpost" href="' + url + '" target="_blank"><div class="userpost__top"><div class="userpost__avatar" style="background-image: url(' + photo + ');"></div><div class="userpost__name" style="font-weight: 700">' + username + '</div><img src="https://uploads-ssl.webflow.com/5c5ac1c89abbac627723a069/5c6923af80da2a82526caa25_instagram%20icon.png" alt="" class="userpost__icon" /></div><div class="userpost__image" style="background-image: url(' + photo + '), url(' + photo2 + ');background-size: cover;background-position: center;"></div><div class="userpost__bottom"><div class="userpost__likes" style="font-weight: 700"><div class="userpost__likes-count">' + likes + '</div></div><div class="userpost__desc"><div class="userpost__desc-name" style="font-weight: 700">' + username + '</div><div class="userpost__desc-text">' + description + '</div></div></div></a>');
        setTimeout(function(){
          $('.ranking__loader').hide()
          $('.ranking__wrapper').show()
        }, 1000)
      }
    })
  }

  if ($('body.index-page').length > 0) {
    $.ajax({
      url: 'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/contests/active',
      success: function (result) {
        let response = result.data
        response.sort((a,b) => (a.finishAt < b.finishAt) ? 1 : ((b.finishAt < a.finishAt) ? -1 : 0))
        if (response[0] && response[0].finishAt) {
          $('#hidden-time').text(response[0].finishAt)
          startTimer()
        }
      }
    })
    
    var firstTag = $('#first-title-tag').text()
    var last_likes1 = ''
    var last_shortcode1 = ''
    function getTopPosts () {
      $.ajax({
        url: 'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/posts/' + firstTag + '/top?last_likes=' + last_likes1 + '&last_shortcode=' + last_shortcode1,
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
                var description = $($.parseHTML(firstTopResult[i].description)).text()
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
                  var avatar = 'https://uploads-ssl.webflow.com/5c5ac1c89abbac627723a069/5c6fd9796978d23bee8b4216_avatar_und.jpg'
                }
                $('#first-tag-top').append('<a class="instacard" href="' + url + '" target="_blank"><div class="instacard__top"><div class="instacard__avatar" style="background-image: url(' + avatar + ')"></div><div class="instacard__name">' + username + '</div><img src="https://uploads-ssl.webflow.com/5c5ac1c89abbac627723a069/5c6923af80da2a82526caa25_instagram%20icon.png" alt="" class="instacard__icon" /></div><div class="instacard__image" style="background-image: url(' + photo + '), url(' + photo2 + ');"></div><div class="instacard__bottom"><div class="instacard__likes"><div class="instacard__likes-count">' + likes + '</div></div><div class="instacard__desc"><div class="instacard__desc-name">' + username + '</div><div class="instacard__desc-text">' + description + '</div></div></div></a>');
              })
            }
            showTopPosts()
          } else {
            $('#first-top-show-more').css({
               'border' : 'none',
               'width' : '150px',
               'pointerEvents' : 'none'
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
        url: 'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/posts/' + firstTag + '/fresh?last_photo_timestamp=' + last_time1 + '&last_shortcode=' + last_shortcode11,
        success: function (result) {
          firstRecentResult = result.data
          if (firstRecentResult.length > 0) {
            var last = result.last
            last_time1 = last.photo_timestamp
            last_shortcode11 = last.shortcode
            $('#first-tag-recent .loadingposts').remove()
            $('#first-recent-show-more').text('Show More')
            function showRecentPosts () {
              $.each(firstRecentResult, function (i, e) {
                var description = $($.parseHTML(firstRecentResult[i].description)).text()
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
                  var avatar = 'https://uploads-ssl.webflow.com/5c5ac1c89abbac627723a069/5c6fd9796978d23bee8b4216_avatar_und.jpg'
                }
                $('#first-tag-recent').append('<a class="instacard" href="' + url + '" target="_blank"><div class="instacard__top"><div class="instacard__avatar" style="background-image: url(' + avatar + ')"></div><div class="instacard__name">' + username + '</div><img src="https://uploads-ssl.webflow.com/5c5ac1c89abbac627723a069/5c6923af80da2a82526caa25_instagram%20icon.png" alt="" class="instacard__icon" /></div><div class="instacard__image" style="background-image: url(' + photo + '), url(' + photo2 + ');"></div><div class="instacard__bottom"><div class="instacard__likes"><div class="instacard__likes-count">' + likes + '</div></div><div class="instacard__desc"><div class="instacard__desc-name">' + username + '</div><div class="instacard__desc-text">' + description + '</div></div></div></a>');
              })
            }
            showRecentPosts()
          } else {
            $('#first-recent-show-more').css({
               'border' : 'none',
               'width' : '150px',
               'pointerEvents' : 'none'
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
        url: 'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/posts/' + secondTag + '/top?last_likes=' + last_likes2 + '&last_shortcode=' + last_shortcode2,
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
                var description = $($.parseHTML(secondTopResult[i].description)).text()
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
                  var avatar = 'https://uploads-ssl.webflow.com/5c5ac1c89abbac627723a069/5c6fd9796978d23bee8b4216_avatar_und.jpg'
                }
                $('#second-tag-top').append('<a class="instacard" href="' + url + '" target="_blank"><div class="instacard__top"><div class="instacard__avatar" style="background-image: url(' + avatar + ')"></div><div class="instacard__name">' + username + '</div><img src="https://uploads-ssl.webflow.com/5c5ac1c89abbac627723a069/5c6923af80da2a82526caa25_instagram%20icon.png" alt="" class="instacard__icon" /></div><div class="instacard__image" style="background-image: url(' + photo + '), url(' + photo2 + ');"></div><div class="instacard__bottom"><div class="instacard__likes"><div class="instacard__likes-count">' + likes + '</div></div><div class="instacard__desc"><div class="instacard__desc-name">' + username + '</div><div class="instacard__desc-text">' + description + '</div></div></div></a>');
              })
            }
            showTopPosts()
          } else {
            $('#second-top-show-more').css({
               'border' : 'none',
               'width' : '150px',
               'pointerEvents' : 'none'
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
        url: 'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/posts/' + secondTag + '/fresh?last_photo_timestamp=' + last_time2 + '&last_shortcode=' + last_shortcode22,
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
                var description = $($.parseHTML(secondRecentResult[i].description)).text()
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
                  var avatar = 'https://uploads-ssl.webflow.com/5c5ac1c89abbac627723a069/5c6fd9796978d23bee8b4216_avatar_und.jpg'
                }
                $('#second-tag-recent').append('<a class="instacard" href="' + url + '" target="_blank"><div class="instacard__top"><div class="instacard__avatar" style="background-image: url(' + avatar + ')"></div><div class="instacard__name">' + username + '</div><img src="https://uploads-ssl.webflow.com/5c5ac1c89abbac627723a069/5c6923af80da2a82526caa25_instagram%20icon.png" alt="" class="instacard__icon" /></div><div class="instacard__image" style="background-image: url(' + photo + '), url(' + photo2 + ');"></div><div class="instacard__bottom"><div class="instacard__likes"><div class="instacard__likes-count">' + likes + '</div></div><div class="instacard__desc"><div class="instacard__desc-name">' + username + '</div><div class="instacard__desc-text">' + description + '</div></div></div></a>');
              })
            }
            showRecentPosts()
          } else {
            $('#second-recent-show-more').css({
               'border' : 'none',
               'width' : '150px',
               'pointerEvents' : 'none'
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
        url: 'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/posts/' + thirdTag + '/top?last_likes=' + last_likes3 + '&last_shortcode=' + last_shortcode3,
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
                var description = $($.parseHTML(thirdTopResult[i].description)).text()
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
                  var avatar = 'https://uploads-ssl.webflow.com/5c5ac1c89abbac627723a069/5c6fd9796978d23bee8b4216_avatar_und.jpg'
                }
                $('#third-tag-top').append('<a class="instacard" href="' + url + '" target="_blank"><div class="instacard__top"><div class="instacard__avatar" style="background-image: url(' + avatar + ')"></div><div class="instacard__name">' + username + '</div><img src="https://uploads-ssl.webflow.com/5c5ac1c89abbac627723a069/5c6923af80da2a82526caa25_instagram%20icon.png" alt="" class="instacard__icon" /></div><div class="instacard__image" style="background-image: url(' + photo + '), url(' + photo2 + ');"></div><div class="instacard__bottom"><div class="instacard__likes"><div class="instacard__likes-count">' + likes + '</div></div><div class="instacard__desc"><div class="instacard__desc-name">' + username + '</div><div class="instacard__desc-text">' + description + '</div></div></div></a>');
              })
            }
            showTopPosts()
          } else {
            $('#third-top-show-more').css({
               'border' : 'none',
               'width' : '150px',
               'pointerEvents' : 'none'
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
        url: 'https://1y2im047b7.execute-api.us-east-2.amazonaws.com/stage/posts/' + thirdTag + '/fresh?last_photo_timestamp=' + last_time3 + '&last_shortcode=' + last_shortcode33,
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
                var description = $($.parseHTML(thirdRecentResult[i].description)).text()
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
                  var avatar = 'https://uploads-ssl.webflow.com/5c5ac1c89abbac627723a069/5c6fd9796978d23bee8b4216_avatar_und.jpg'
                }
                $('#third-tag-recent').append('<a class="instacard" href="' + url + '" target="_blank"><div class="instacard__top"><div class="instacard__avatar" style="background-image: url(' + avatar + ')"></div><div class="instacard__name">' + username + '</div><img src="https://uploads-ssl.webflow.com/5c5ac1c89abbac627723a069/5c6923af80da2a82526caa25_instagram%20icon.png" alt="" class="instacard__icon" /></div><div class="instacard__image" style="background-image: url(' + photo + '), url(' + photo2 + ');"></div><div class="instacard__bottom"><div class="instacard__likes"><div class="instacard__likes-count">' + likes + '</div></div><div class="instacard__desc"><div class="instacard__desc-name">' + username + '</div><div class="instacard__desc-text">' + description + '</div></div></div></a>');
              })
            }
            showRecentPosts()
          } else {
            $('#third-recent-show-more').css({
               'border' : 'none',
               'width' : '150px',
               'pointerEvents' : 'none'
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