
var trivialcats;

//vars for method search
var method;
var methodlist = [];
var searchvalue = "";
var matchmethods = [];
//big list of method titles
var methodtitles = [];

//index to each method's variation class(es)
var methodvarindex;
//index to method info (pn, ccNum)
var methodindex;
//index to the variation classes
var trivialclasses;

$(function() {
  setup();

  $("#methodtitle").on("click", methodsearch);
  $("#methodtitle").on("keyup", methodsearch);
  $("#methodlist").on("click", "li", (e) => {
    $("#methodtitle").val($(e.currentTarget).text());
    $("#methodlist li").hide();
    $("#choosemethod").removeClass("disabled");
    e.stopPropagation();
  });
  
  $("table").on("click", ".methodtitle", titleclick);
  $("#choosemethod").on("click", choosemethodclick);

  $("table.sortable").on("click", "th", tableheadclick);
});


function setup() {
  //methodvarindex = window.methodvarindex;
  methodindex = window.methodindex;
  trivialclasses = window.trivialclasses;
  //trivialcats = window.trivialcats;
  methodtitles = Object.keys(methodindex);
  console.log(methodtitles.length + " method titles");
}




function choosemethodclick() {
  if (!$("#choosemethod").hasClass("disabled")) {
    let title = $("#methodtitle").val();
    let m = methodindex[title];
    if (m) {
      viewmethod(title);
    }
  }
}


function titleclick(e) {
  let title = $(this).text();
  viewmethod(title);
}

let sortindicator = `<span class="sortindicator">&nbsp;&#x25BE;</span>`
function viewmethod(title) {
  $("table").hide();
  $("th.pn,.sortindicator").remove();
  ["sorttable_sorted","sorttable_sorted_reverse"].forEach(c => {
    $("."+c).removeClass(c);
  });
  
  
  method = methodindex[title];
  let cc = method.tvclasses;
  
  let pn = method.pn;
  //display title
  //complib link
  //how many trivial variation classes
  let html = `<h3>${title}</h3>
  <a href="https://complib.org/method/${method.ccNum}" target="blank">View on complib</a>
  <p>${cc.length} trivial variation class`;
  if (cc.length > 1) html += `es`;
  html += `</p>`;
  $("#methodinfo").html(html);
  let vartitleobj = {};
  
  cc.forEach((c,i) => {
    let tt = trivialclasses[c].filter(t => !vartitleobj[t] && t != title);
    tt.forEach(t => {
      vartitleobj[t] = i+1;
    });
  });
  let vartitles = Object.keys(vartitleobj);
  //console.log(vartitles.length);
  let text = vartitles.length + " trivial variation";
  if (vartitles.length != 1) text += "s";
  $("#methodinfo").append(`<p>${text}</p>`);
  if (vartitles.length) {
    //pn table column headers
    pn.forEach((s,j) => {
      let th = s.length ? s : "x";
      if (j === pn.length/2 - 1) th = "HL: "+th;
      $("thead tr").append(`<th class="pn">${th}</th>`);
    });
    $("thead tr").append(`<th class="pn sort_numeric">pn difference count</th>`);
    $("thead th:first-child").addClass("sorttable_sorted").append(sortindicator);
    vartitles.sort();
    let tbody = "";
    vartitles.forEach(t => {
      let m = methodindex[t];
      let tr = `
      <tr><td${m ? ` class="methodtitle"`: ""}>${t}</td><td>${vartitleobj[t]}</td><td>`;
      if (m && m.tvclasses.length > 1) tr += `*`;
      tr += `</td>`;
      if (m) {
        let mpn = methodindex[t].pn;
        let countdiff = 0;
        mpn.forEach((s,i) => {
          let c = s === pn[i] ? ` class="same"` : "";
          if (c.length === 0) countdiff++;
          tr += `<td${c}>${s.length ? s : "x"}</td>`;
        });
        tr += `<td>${countdiff}</td>`;
      }
      tr += `</tr>`;
      tbody += tr;
    });
    //add the tbody
    $("tbody").html(tbody);
    $("table").show();
  } else {
    
  }
  
}





function methodsearch(e) {
  
  $(document.body).on("click.menuHide", () => {
    $("#methodlist li").hide();
    $(this).off("click.menuHide");
  });
  
  let value = $(this).val().toLowerCase();
  //console.log(value);
  
  if (/^[^\s]/.test(value)) {
    if (searchvalue.length && value.slice(0,-1) === searchvalue) {
      //if a character has been added to the previous search
      let i = 0;
      while (i < methodlist.length) {
        if (methodlist[i].toLowerCase().indexOf(value) === -1) {
          $("#methodlist li:nth-child("+(i+1)+")").remove();
          methodlist.splice(i,1);
        } else {
          i++;
        }
      }
      
      matchmethods = matchmethods.filter(m => m.toLowerCase().includes(value));
    } else if (searchvalue.length && searchvalue.slice(0,-1) === value) {
      //if a character has been removed from the previous search
      for (let i = 0; i < methodtitles.length; i++) {
        let title = methodtitles[i];
        if (title.toLowerCase().includes(value) && !matchmethods.includes(title) && !methodlist.includes(title)) {
          matchmethods.push(title);
        }
      }
    } else if (searchvalue.length === 0 || (value.length === 1 && searchvalue.length > 1)) {
      //if this is a new search
      $("#methodlist li").remove();
      methodlist = [];
      matchmethods = [];
      for (let i = 0; i < methodtitles.length; i++) {
        if (methodtitles[i].toLowerCase().includes(value)) {
          matchmethods.push(methodtitles[i]);
        }
      }
    }
    if (methodlist.length < 16 && matchmethods.length) {
      let i = methodlist.length;
      do {
        let best = matchmethods.findIndex(m => m.toLowerCase().startsWith(value));
        let j = best > -1 ? best : Math.floor(Math.random() * matchmethods.length);
        methodlist.push(matchmethods[j]);
        $("#methodlist").append("<li>"+matchmethods[j]+"</li>");
        matchmethods.splice(j,1);
        i++;
      } while (matchmethods.length && i <= 16);
    }
    $("#methodlist li").show();
    if (methodlist.length > 1 && !$("#choosemethod").hasClass("disabled")) $("#choosemethod").addClass("disabled");
    searchvalue = value;
    
  } else if (value.length === 0) {
    $("#methodlist li").remove();
    searchvalue = "";
    methodlist = [];
    matchmethods = [];
  }
}



