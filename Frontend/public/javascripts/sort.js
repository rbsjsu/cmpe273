// =========== SORTING=====================================
  $("select.cs-sort").change(function(){
    var t = $(this).val();
      switch (t) {

          case "price-lth":
              $(".product-index-box").sort(function (a, b) {
                  var f = parseInt($(b).find('div.price').text().substring(4));
                  var s = parseInt($(a).find('div.price').text().substring(4));
                  return (f < s) ? 1 : -1;
              }).appendTo("div.productList");
              break;

          case "price-htl":
              $(".product-index-box").sort(function (a, b) {
                  var f = parseInt($(b).find('div.price').text().substring(4));
                  var s = parseInt($(a).find('div.price').text().substring(4));
                  return (f > s) ? 1 : -1;
              }).appendTo("div.productList");
              break;

          case "name-atz":
              $(".product-index-box").sort(function (a, b) {
                  var f = $(b).find('.productTitle').text();
                  var s = $(a).find('.productTitle').text();


                  return (f < s) ? 1 : -1;
              }).appendTo("div.productList");
              break;

          case "name-zta":
              $(".product-index-box").sort(function (a, b) {
                  var f = $(b).find('.productTitle').text();
                  var s = $(a).find('.productTitle').text();


                  return (f > s) ? 1 : -1;
              }).appendTo("div.productList");
              break;

          case "rating":
              $(".product-index-box").sort(function (a, b) {
                  var f = $(b).find('div.rating').children('span').text();
                  var s = $(a).find('div.rating').children('span').text();
               

                  return (f > s) ? 1 : -1;
              }).appendTo("div.productList");
              break;

          case "relevance":
              $(".product-index-box").sort(function (a, b) {
                  var f = parseFloat($(b).attr("cs-score"));
                  var s = parseFloat($(a).attr("cs-score"));
                  
                  return (f > s) ? 1 : -1;
              }).appendTo("div.productList");
              break;
              
      }
})