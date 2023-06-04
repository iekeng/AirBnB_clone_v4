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
    error: function(xhr, testStatus, error) {
      $('#api_status').removeClass('available');
    }
  });
});
