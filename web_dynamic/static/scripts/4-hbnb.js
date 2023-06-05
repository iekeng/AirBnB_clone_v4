 $(function(){
  checkedAmenities = {};	
  $('.amenities input:checkbox').change(function() {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');
    if (this.checked) {
      checkedAmenities[amenityId] = amenityName;
    }
    else {
      delete checkedAmenities[amenityId];
    }
  });
  
  desiredAmenities = Object.values(checkedAmenities).join(', ');
  $('.amenities h4').text(desiredAmenities);

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/status/',
    method: 'GET',
    success: function(data, textStatus, xhr) {
      $('#api_status').addClass('available');
    },
    error: function(xhr, textStatus, error) {
      $('#api_status').removeClass('available');
    }
  });

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    data: {},
    success: function(data, textStatus){
      populate(data);
    },
  });

  function populate(data) {
    $.each(data, function(place, value){
      const article = document.createElement('article');

      const title = document.createElement('div');
      const place = document.createElement('h2');
      const pricing = document.createElement('div');

      const info = document.createElement('div');
      const guests = document.createElement('div');
      const rooms = document.createElement('div');
      const b_rooms = document.createElement('div');

      const user = document.createElement('div');

      const desc = document.createElement('div');

      const section = $('section .places');

      $(title).addClass('title_box');
      $(place).text(place.name);
      $(pricing).addClass('price_by_night');
      $(pricing).text(place.price_by_night);

      $(info).addClass('information');

      $(guests).addClass('max_guest');
      let pl = place.max_guest === 1 ? '' : s;
      $(guests).text(place.max_guest + 'Guest' + pl);

      pl = place.number_bathrooms === 1 ? '' : 's';
      $(rooms).addClass('number_rooms');
      $(rooms).text(place.number_rooms + 'Bedroom' + pl);

      pl = place.number_bathrooms === 1 ? '' : 's';
      $(b_rooms).addClass('number_bathrooms');
      $(b_rooms).text(place.number_bathrooms + 'Bathroom' + pl);

      $(user).addClass('user');
      if (place.user) $(user).append(place.user.first_name + ' ' + place.user.last_name);

      $(desc).addClass('description');
      if (place.description) {
        $(desc).html(place.description);
      } else {
        $(desc).text('safe');
      }

      $(title).append(place).append(pricing);
      $(info).append(guests).append(rooms).append(b_rooms);
      $(article).append(title).append(info).append(user).append(desc);
      section.append(article);

    });
  }

  $('button').click(function() {
    $.ajax({
      url: 'http://127.0.0.1:5001/api/v1/places_search/',
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      data: {'amenities': Object.keys(desiredAmenities)},
      success: function(data, textStatus, xhr) {
        if(xhr.status == 200){
          $('section .places').empty();
        populate(data);
        }
      },
    });
  });
});
