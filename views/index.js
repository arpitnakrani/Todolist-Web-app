var date = new Date();
var options = {
  weekday: "long",
  month: "long",
  day: "numeric",
};
var currdayname = date.toLocaleDateString("us-en", options);
var name = "arpit"

module.exports = {
    name,
    currdayname,
};