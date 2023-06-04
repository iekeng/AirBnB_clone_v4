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
  
  desiredAmenities = Object.values(checkedAmenities).join(', ')
  $('.amenities h4').text(desiredAmenities)
});
