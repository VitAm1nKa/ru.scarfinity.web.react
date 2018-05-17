export function DateFormat(dateTimeString) {
    var date = new Date(dateTimeString);

    var mm = date.getMonth() + 1; // getMonth() is zero-based
    var dd = date.getDate();

    // return date.toLocaleString();
  
    return [date.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd,
            date.getHours(),
            date.getMinutes()
           ].join('');
}