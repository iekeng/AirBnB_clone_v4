 $(function(){
  const checkedAmenities = {};
  const checkedStates = {};
  const checkedCities = {};

  $('.amenities li input:checkbox').change(function() {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');
    if (this.checked) {
      checkedAmenities[amenityId] = amenityName;
    } else {
      delete checkedAmenities[amenityId];
    }

  desiredAmenities = Object.values(checkedAmenities).join(', ');
  $('.amenities h4').text(desiredAmenities);
  });

  $('.state').change(function() {
    const stateId = $(this).data('id');
    const stateName = $(this).data('name');

    if (this.checked) {
      checkedStates[stateId] = stateName; 
    } else {
      delete checkedStates[stateId];
    }

    desiredStates = Object.values(checkedStates).join(', ');
    $('.locations h4').text(desiredStates);
  });

  $('.city').change(function() {
    const cityId = $(this).data('id');
    const cityName = $(this).data('name');

    if (this.checked) {
      checkedCities[cityId] = cityName; 
    } else {
      delete checkedCities[cityId];
    }

    desiredCities = Object.values(checkedCities).join(', ');
    $('.locations h4').text(desiredCities);
  });
  
  

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/status/',
    method: 'GET',
    success: function(data, statusText, xhr) {
      $('#api_status').addClass('available');
    },
    error: function(xhr, statusText, error) {
      $('#api_status').removeClass('available');
    }
  });

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    data: {},
    success: function(data, statusText){
      populate(data);
    },
  }).promise().done(() => {
  $("article span").on('click', function() {
      if ($(this).text() === 'show'){
			displayReviews($(this).closest('article'));
			$(this).text('hide');
		  } else {
			  removeReviews($(this).closest('article'));
			  $(this).text('show');
		}
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
      data: {'amenities': Object.keys(desiredAmenities), 
            'states': Object.keys(desiredStates), 
            'cities': Object.keys(desiredCities)},
      success: function(data, statusText, xhr) {
        if(xhr.status == 200){
          $('section .places').empty();
        populate(data);
        }
      },
    });
  });
});
