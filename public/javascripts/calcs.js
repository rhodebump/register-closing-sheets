 function calculateOpenTotals() {

     var total = parseFloat($('#open_1cent').val());
     console.log("total1=" + total);
     total = total + parseFloat($('#open_5cents').val());
     total = total + parseFloat($('#open_10cents').val());
     total = total + parseFloat($('#open_25cents').val());
     total = total + parseFloat($('#open_1dollar').val());
     total = total + parseFloat($('#open_5dollars').val());
     total = total + parseFloat($('#open_10dollars').val());
     total = total + parseFloat($('#open_20dollars').val());

     total = total + parseFloat($('#open_50dollars').val());

     total = total + parseFloat($('#open_100dollars').val());


     $('#open_total').val(total);
 }


 function addEventHandlers() {
     // $('#processdate').datepicker();
     $("#processdate").datepicker({
         dateFormat: "yy-mm-dd"
     });
     // $( "#enddate" ).datepicker({ dateFormat: "yy-mm-dd" });
     $("#opening input").change(function () {
         calculateAll();

     });

     $("#closing input").change(function () {
         calculateAll();

     });

     $("#sales input").change(function () {
         calculateAll();
     });

     $("#income input").change(function () {
         calculateAll();

     });

     $("#diff input").change(function () {
         calculateAll();
     });



     populateDataIfId();


 }

 function getParameterByName(name) {
     name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
     var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
         results = regex.exec(location.search);
     return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
 }

 function populateDataIfId() {
     var id = getParameterByName("id");

     if (id == null || id == '') {
         console.log("no id parameter");
         return;
     }
     console.log("got id parameter " + id);
     $.getJSON('/api/daysheet/' + id, function (data) {

         // For each item in our JSON, add a table row and cells to the content string
         // $.each(data, function () {


         $('#open_1cent').val(data.open_1cent);
         $('#open_5cents').val(data.open_5cents);
         $('#open_10cents').val(data.open_10cents);
         $('#open_25cents').val(data.open_25cents);
         $('#open_1dollar').val(data.open_1dollar);
         $('#open_5dollars').val(data.open_5dollars);
         $('#open_10dollars').val(data.open_10dollars);
         $('#open_20dollars').val(data.open_20dollars);
         $('#open_50dollars').val(data.open_50dollars);
         $('#open_100dollars').val(data.open_100dollars);


         $('#close_1cent').val(data.close_1cent);
         $('#close_5cents').val(data.close_5cents);
         $('#close_10cents').val(data.close_10cents);
         $('#close_25cents').val(data.close_25cents);
         $('#close_1dollar').val(data.close_1dollar);
         $('#close_5dollars').val(data.close_5dollars);
         $('#close_10dollars').val(data.close_10dollars);
         $('#close_20dollars').val(data.close_20dollars);
         $('#close_50dollars').val(data.close_50dollars);
         $('#close_100dollars').val(data.close_100dollars);


         $('#bisque_sales').val(data.bisque_sales);
         $('#paint_time').val(data.paint_time);
         $('#child_party').val(data.child_party);
         $('#adult_party').val(data.adult_party);
         $('#party_deposit').val(data.party_deposit);
         $('#gift_certificates_sold').val(data.gift_certificates_sold);
         $('#credit_card_tips').val(data.credit_card_tips);
         $('#sub_total_sales').val(data.sub_total_sales);
         $('#sales_tax').val(data.sales_tax);
         $('#gross_sales').val(data.gross_sales);


         $('#income_cash_store').val(data.income_cash_store);
         $('#income_debits').val(data.income_debits);
         $('#income_checks').val(data.income_checks);
         $('#income_credit_card').val(data.income_credit_card);
         $('#income_coupon').val(data.income_coupon);
         $('#income_receipts').val(data.income_receipts);
         $('#income_deposit_redeemed').val(data.income_deposit_redeemed);
         $('#income_gift_certificate_redeemed').val(data.income_gift_certificate_redeemed);
         $('#income_total').val(data.income_total);


         $('#openername').val(data.openername);
         $('#closername').val(data.closername);
         $('#processdate').val(data.processdate);
         $('#store').val(data.store);




         $('#totala').val(data.totala);
         $('#totalb').val(data.totalb);
         $('#difference').val(data.difference);
         $('#income_cash_tips').val(data.income_cash_tips);


     });

 }

 function calculateAll() {
     calculateOpenTotals();
     calculateClosingTotals();
     calculateIncomeTotals();
     calculateDiffTotal();
     calculateSalesTotals();

 }

 function calculateDiffTotal() {
     var totala = parseFloat($('#totala').val());
     var totalb = parseFloat($('#totalb').val());
     var total = totala - totalb;


     $('#difference').val(total);
 }



 function calculateSalesTotals() {

     var total = parseFloat($('#bisque_sales').val());
     total = total + parseFloat($('#paint_time').val());
     total = total + parseFloat($('#child_party').val());
     total = total + parseFloat($('#adult_party').val());
     total = total + parseFloat($('#party_deposit').val());

     total = total + parseFloat($('#gift_certificates_sold').val());
     total = total + parseFloat($('#credit_card_tips').val());

     $('#sub_total_sales').val(total);
     total = total + parseFloat($('#sales_tax').val());
     $('#gross_sales').val(total);
     $('#totala').val(total);




 }

 function calculateIncomeTotals() {

     var total = parseFloat($('#income_cash_store').val());
     total = total + parseFloat($('#income_debits').val());
     total = total + parseFloat($('#income_checks').val());
     total = total + parseFloat($('#income_credit_card').val());
     total = total + parseFloat($('#income_coupon').val());
     total = total + parseFloat($('#income_receipts').val());
     total = total + parseFloat($('#income_deposit_redeemed').val());


     total = total + parseFloat($('#income_gift_certificate_redeemed').val());
     $('#income_total').val(total);
     $('#totalb').val(total);

 }

 function calculateClosingTotals() {

     var total = parseFloat($('#close_1cent').val());
     total = total + parseFloat($('#close_5cents').val());
     total = total + parseFloat($('#close_10cents').val());
     total = total + parseFloat($('#close_25cents').val());
     total = total + parseFloat($('#close_1dollar').val());
     total = total + parseFloat($('#close_5dollars').val());
     total = total + parseFloat($('#close_10dollars').val());
     total = total + parseFloat($('#close_20dollars').val());
     total = total + parseFloat($('#close_50dollars').val());
     total = total + parseFloat($('#close_100dollars').val());

     $('#close_total').val(total);
     //now let's set this to be closing total -100
     $('#income_cash_store').val(total - 100.00);


 }