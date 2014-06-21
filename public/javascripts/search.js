function populateTable(data) {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    // $.getJSON('/users/userlist', function (data) {

    // For each item in our JSON, add a table row and cells to the content string

    //"newsheet?id=#{daysheet._id}") #{daysheet.processdate}  #{daysheet.store} #{daysheet.income_cash_tips} #{daysheet.income_cash_tips}
    var totaltips = 0;
    $.each(data, function () {
        tableContent += '<tr>';
        tableContent += '<td><a href="daysheet?id=' + this._id + '" title="Show Details">Show Details</a></td>';
        tableContent += '<td>' + this.processdate + '</td>';
        var tips = parseFloat(this.income_cash_tips) + parseFloat(this.credit_card_tips);
        var tips2 = tips.toFixed(2);
        tableContent += '<td>' + tips2 + '</td>';
        totaltips = totaltips + tips;
        tableContent += '<td>' + this.store + '</td>';
        tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#daysheetlist table tbody').html(tableContent);
    var totaltips2 = totaltips.toFixed(2);

    $('#totaltips').html("Total tips:" + totaltips2);


};

function addEventHandlers() {
    $("#startdate").datepicker({
        dateFormat: "yy-mm-dd"
    });
    $("#enddate").datepicker({
        dateFormat: "yy-mm-dd"
    });
    //$('#startdate').datepicker();
    //  $('#enddate').datepicker();
    $("#searchbutton").click(function () {
        $.getJSON('/api/daysheet/search', $('#searchform').serialize(), populateTable);
        return false;
    });

}