!function(o){"use strict";o(document).ready((function(){function n(n){o.ajax({type:"POST",dataType:"json",url:"/wp-json/v1/content-optimizer",data:{dataId:n},beforeSend:function(){o(".contop-load").show()},complete:function(n){o(".contop-load").hide()}}).done((function(t){"posts"==n&&function(n){const t=JSON.parse(n.body);console.log(t);var e=[];for(const o of t)e.push("<li data-reportid='"+o.id+"'>"+o.title+"</li>");e=e.join(" "),o("ul.contop-list").append(e)}(t),3==n&&function(n){const t=JSON.parse(n.body);o("#contop-report-submit-btn").after("<p>"+t.id+t.title+"</p>")}(t)})).fail((function(o,n,t){var e=o.status+": "+o.statusText;console.log("Error - "+e)}))}console.log(contentoptimizer_globals.is_gutenberg),o("body").addClass("contentoptimizer-enabled"),function(){o("body").append(`<div class='contop-overlay'>\n          <div class='contop-overlay-inner'>\n            <span class='contop-close'>Close</span>\n              <div class='contop-overlay-content'>\n                <h2>Current Reports</h2>\n                <p><strong>Select a Report</strong></p>\n                <div class='contop-load'>\n                  <img src='${contentoptimizer_globals.plugin_dir}/images/load.gif'/>\n                </div>\n                <ul class="contop-list"></ul>\n              </div>\n          </div>\n        </div>`),o("span.contop-close").on("click",(function(n){o("html,body").css("overflow-y","scroll"),o(".contop-overlay").removeClass("contop-open"),o("ul.contop-list").empty()}));var n=document.getElementsByClassName("contop-overlay")[0];document.getElementsByClassName("contop-overlay-inner")[0].addEventListener("click",(function(o){o.stopPropagation()})),n.addEventListener("click",(function(){o(".contop-overlay").removeClass("contop-open"),o("html,body").css("overflow-y","scroll")}))}(),o("#contop-get-reports-btn").on("click",(function(t){t.preventDefault(),o(".contop-overlay").addClass("contop-open"),o("html,body").css("overflow-y","hidden");n("posts")})),o("#contop-report-submit-btn").on("click",(function(t){t.preventDefault();n(o("#contop-reportId").val())}))})),tinyMCE.init({theme:"advanced",mode:"textareas"})}(jQuery);