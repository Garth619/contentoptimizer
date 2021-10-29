(function ($) {
  "use strict";

  /**
   * some trashy demo jquery to get started. This will be redone later once we can get workflow and designs figured out with classes and better templating
   */

  $(document).ready(function () {
    //console.log(contentoptimizer_globals.is_gutenberg);

    $("body").addClass("contentoptimizer-enabled");

    /**
     * an overlay that houses the reports list - just for demo purposes
     * @param {string} title does nothing yet
     * @param {string} description does nothing yet
     * contentoptimizer_globals.plugin_dir is php variable to get plugin directory
     */
    function contopOverlay(title, description) {
      $("body").append(
        `<div class='contop-overlay'>
          <div class='contop-overlay-inner'>
            <span class='contop-close'>Close</span>
            <div class='contop-load'>
             <img src='${contentoptimizer_globals.plugin_dir}/images/load.gif'/>
            </div>
            <div class='contop-overlay-content'>
              <div id='contop-reports-list' class="contop-module">
                <h2>Reports List</h2>
                <p><strong>Select a Report to Optimize</strong></p>
                <ul class='contop-list'></ul>
              </div>
              <div id='contop-add-report' class="contop-module">
                <h2>Add this Report?</h2>
                <p class="contop-subtitle"><strong> Title:</strong><br><span></span></p>
                <p>This will override your current content</p>
                <button id="contop-add-report-btn">Add Report</button>
                <p id="contop-goback"><a>No, go back to the list</a></p>
              </div>
            </div>
          </div>
        </div>`
      );
      /**
       * click function that fires
       */
      $("span.contop-close").on("click", function (e) {
        contopoverlayView("close");
      });
      var overlay = document.getElementsByClassName("contop-overlay")[0];
      var overlayinner = document.getElementsByClassName(
        "contop-overlay-inner"
      )[0];

      overlayinner.addEventListener("click", function (e) {
        e.stopPropagation();
      });

      overlay.addEventListener("click", function () {
        contopoverlayView("close");
      });
    }

    contopOverlay();

    function contopoverlayView(view) {
      if (view == "open") {
        $(".contop-overlay").addClass("contop-open");
        $("html,body").css("overflow-y", "hidden");
      }
      if (view == "close") {
        $(".contop-overlay").removeClass("contop-open");
        $("html,body").css("overflow-y", "scroll");
        $("ul.contop-list").empty();
      }
    }

    function contopShowmodule(module) {
      $(".contop-module").hide();
      $(module).show();
    }

    $("#contop-get-reports-btn").on("click", function (e) {
      e.preventDefault();
      contopoverlayView("open");
      contopShowmodule("#contop-reports-list");
      contopajaxResults("reportsfeed");
      if (!$("#wp-content-wrap").hasClass("tmce-active")) {
        $("#content-tmce").click();
      }
    });

    function contopReportlist(data) {
      const dataParses = JSON.parse(data.body);
      console.log(dataParses);
      var appendText = [];
      for (const dataParse of dataParses) {
        appendText.push(
          "<li class='report-list-item' data-reportid='" +
            dataParse.id +
            "'>" +
            dataParse.title +
            "</li>"
        );
      }
      appendText = appendText.join(" ");
      $("ul.contop-list").append(appendText);

      $(".report-list-item").on("click", contopClickreport); // pull out and make event listener

      function contopClickreport() {
        var reportid = $(this).data("reportid");
        var reporttitle = $(this).text();
        var reportbody = dataParses.find((o) => o.id === reportid);
        contopAddreportwindow(reportid, reporttitle, reportbody.body);
      }
    }

    function contopAddreportwindow(reportid, reporttitle, reportbody) {
      contopShowmodule("#contop-add-report");
      console.log(reporttitle);
      $(".contop-subtitle span").empty().append(reporttitle);
      $("#contop-add-report-btn").on("click", function (e) {
        contopoverlayView("close");
        contopAddcontent(reportid, reportbody);
      });
      $("#contop-goback").on("click", function (e) {
        contopShowmodule("#contop-reports-list");
      });
    }

    // function contopAddreportwindow(reportid, reporttitle, reportbody) {
    //   contopShowmodule("#contop-add-report");
    //   console.log(reporttitle);
    //   $(".contop-subtitle span").empty().append(reporttitle);
    //   // $("#contop-add-report-btn").on("click", function (e) {
    //   //   contopoverlayView("close");
    //   //   contopAddcontent(reportid, reportbody);
    //   // });
    //   // $("#contop-goback").on("click", function (e) {
    //   //   contopShowmodule("#contop-reports-list");
    //   // });
    // }

    // $("#contop-add-report-btn").on("click", function (e) {
    //   contopoverlayView("close");
    //   contopAddcontent(1, "reportbody"); // also problems when loading up reports and losing overly.....inside and outside? just  add the title and returnn array of updated variables, dont add thee other functions until the button is actually clicked
    // });
    // $("#contop-goback").on("click", function (e) {
    //   contopShowmodule("#contop-reports-list");
    // });

    function contopSinglereport(data) {
      const dataParse = JSON.parse(data.body);
      console.log(dataParse);
    }

    // tinymce practice

    // tinyMCE.init({
    //   selector: "textarea",
    //   //mode: "specific_textareas",
    //   //editor_selector: "wp-editor-area",
    //   init_instance_callback: function (editor) {
    //     // timeout after typing stops
    //     let timeout = null;
    //     editor.on("keyup", function (e) {
    //       clearTimeout(timeout);
    //       timeout = setTimeout(function () {
    //         console.log("Element changed:", e.target.nodeName);
    //         contopajaxResults(1); // needs to initate only after a report has been added
    //       }, 500);
    //     });
    //   },
    // });
    function contopAddcontent(reportid, reportbody) {
      // var myContent = tinymce.get("myTextarea").getContent({ format: "text" });
      // var myContent = tinymce.get("myTextarea").getContent({ format: "raw" });
      $("#content-tmce").on("click", function (e) {
        //$("#content-tmce")
        console.log("tt to vt");
        contopajaxResults(reportid);
      });
      if ($("#wp-content-wrap").hasClass("tmce-active")) {
        // replace if with visual tab vars
        tinyMCE.get("content").setContent(reportbody);
        console.log("visual tab - " + reportid + reportbody);
        contopajaxResults(reportid);
      } else {
        // $("textarea#content").empty();
        // $("textarea#content").append(reportbody); // this isnt overriding existing text
        // console.log("text tab - " + reportid + reportbody);
        // might need to have it just work on visual tab
      }
      contopTyping(reportid);
    }

    function contopTyping(reportid) {
      if ($("#wp-content-wrap").hasClass("tmce-active")) {
        // timeout after typing stops
        let timeout = null;
        tinyMCE.get("content").on("keyup", function (e) {
          clearTimeout(timeout);
          timeout = setTimeout(function () {
            console.log("Element changed:", e.target.nodeName);
            contopajaxResults(reportid);
          }, 500);
        });
      } else {
      }
    }

    function contopajaxResults(dataId) {
      $.ajax({
        type: "POST",
        dataType: "json",
        url: "/wp-json/v1/content-optimizer",
        data: { dataId },
        beforeSend: function () {
          $(".contop-load").show();
        },
        complete: function (data) {
          $(".contop-load").hide();
        },
      })
        .done(function (response) {
          //console.log(response);
          if (dataId == "reportsfeed") {
            contopReportlist(response);
          } else {
            contopSinglereport(response);
          }
        })
        .fail(function (xhr, status, error) {
          var errorMessage = xhr.status + ": " + xhr.statusText;
          console.log("Error - " + errorMessage);
        });
    }
  }); // document ready // ajax inside or outside doc ready?
})(jQuery);
