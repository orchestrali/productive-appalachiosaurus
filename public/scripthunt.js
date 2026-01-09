const places = "1234567890ETABCD";

var huntpaths;
var alliancearr;

$(function() {
  //console.log(window.huntpaths.single.plain["13-1-1-r"].methods);
  huntpaths = window.huntpaths;
  alliancearr = Object.keys(huntpaths.single.alliance).map(p => {
    return {p: p, count: huntpaths.single.alliance[p]};
  });
  $(".clickable").on("click", clicktablecell);
});


function clicktablecell(e) {
  if (!$(this).hasClass("selected")) {
    $("#methodcontainer li").remove();
    $("td.selected").removeClass("selected");
    $(this).addClass("selected");
    let id = this.id;
    let arr = id.split("-");
    let stage = Number(arr[arr.length-1]);
    arr.pop();
    let key = arr.join("-");
    let mm = huntpaths.single.plain[key].methods.filter(m => m.stage === stage);
    mm.forEach(m => {
      let str = `<li><a href="https://complib.org/method/${m.ccnum}" target="blank">${m.title}</a></li>`;
      $("#methodcontainer ul").append(str);
    });
  }
}
