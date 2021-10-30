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
     * @param {string} title does nothing yet - id like to use template literals
     * @param {string} description does nothing yet - id like to use template literals
     * contentoptimizer_globals.plugin_dir is php variable to get plugin directory
     */
    function overlay(title, description) {
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
       * click function that fires overlayView()
       */
      $("span.contop-close").on("click", function (e) {
        overlayView("close");
      });
      /**
       * for clicking outside overlay to close it
       * @type {string}
       */
      var overlay = document.getElementsByClassName("contop-overlay")[0];
      /**
       * for clicking outside overlay to close it
       * @type {string}
       */
      var overlayinner = document.getElementsByClassName(
        "contop-overlay-inner"
      )[0];
      /**
       * click outside overlay to close it
       */
      overlayinner.addEventListener("click", function (e) {
        e.stopPropagation();
      });
      /**
       * click outside overlay to close it
       */
      overlay.addEventListener("click", function () {
        overlayView("close");
      });
    }

    overlay();

    /**
     * opens and closes the overlay
     * @param {string} view open | close options
     */
    function overlayView(view) {
      if (view == "open") {
        $(".contop-overlay").addClass("contop-open");
        // freezes html page
        $("html,body").css("overflow-y", "hidden");
      }
      if (view == "close") {
        $(".contop-overlay").removeClass("contop-open");
        // unfreezes html page
        $("html,body").css("overflow-y", "scroll");
        // clears out the reports list ajax call on close
        $("ul.contop-list").empty();
      }
    }
    /**
     * hides all overlay modules and shows the current one based on css class
     * @param {string} module class of overlay module to be shown
     */
    function showModule(module) {
      $(".contop-module").hide();
      $(module).show();
    }
    /**
     * report button in the wordpress admin sidebar
     */
    $("#contop-get-reports-btn").on("click", function (e) {
      // disable default button click
      e.preventDefault();
      // open overlay
      overlayView("open");
      // show overlay module that shows list of reports
      showModule("#contop-reports-list");
      // ajax list of reports
      ajaxResults("reportsfeed");
      // if the user has the text/html tab on in the wordpress text editor, toggle to the visual tab. Inserting reports into the text/html tab is buggy. this tab isnt tinymce and it doesnt work inserting reports there, then toggling back and forth
      if (!$("#wp-content-wrap").hasClass("tmce-active")) {
        $("#content-tmce").click();
      }
    });
    /**
     * ajax response that returns reports and appends to the overlay
     * @param {json} data ajax variable response containing json objects
     */
    function reportList(data) {
      const dataParses = JSON.parse(data.body);
      //console.log(dataParses);
      // create list of reports. report id and report title included
      var appendText = [];
      for (const dataParse of dataParses) {
        appendText.push(
          "<li class='report-list-item' data-reportbody='" + // body too much data? then maybe we can get this id and ajax to the single report endpoint when clicking "add report button"
            dataParse.body +
            "' data-reportid='" +
            dataParse.id +
            "'>" +
            dataParse.title +
            "</li>"
        );
      }
      // append reports to ul.contop-list
      appendText = appendText.join(" ");
      $("ul.contop-list").append(appendText);
    }
    /**
     * when li.report-list-item is clicked, grab that choice's data attr
     * insert them to the "add report" button data attr
     * then show "add report?" module
     */
    $("ul.contop-list").on("click", ".report-list-item", function (e) {
      // get data attr
      const reportid = $(this).data("reportid");
      const reportbody = $(this).data("reportbody");
      const reporttitle = $(this).text();
      // insert on the "add report" button
      $("#contop-add-report-btn").attr("data-reportid", reportid);
      $("#contop-add-report-btn").attr("data-reportbody", reportbody);
      $(".contop-subtitle span").empty().append(reporttitle);
      // show "add report?" module
      showModule("#contop-add-report");
    });

    /**
     * "add report?" button click
     * insert "add report?" button data attr into the tinymce visual tab
     * run ajax request of word count etc once the report is added in
     */
    $("#contop-add-report-btn").on("click", function (e) {
      // get "add report?" button data attr
      const reportid = $(this).attr("data-reportid");
      const reportbody = $(this).attr("data-reportbody");
      // insert "add report?" button data attr into the tinymce visual tab
      if ($("#wp-content-wrap").hasClass("tmce-active")) {
        tinyMCE.get("content").setContent(reportbody);

        //console.log(reportid + " " + reportbody);
        // run ajax request of word count etc once the report is added in
        ajaxResults(reportid); // i wonder if this will be fixed data at first that comes along with report
      } else {
        // text/html tab isnt working
        //
        // $("textarea#content").empty();
        // $("textarea#content").append(reportbody); // this isnt overriding existing text
        // console.log("text tab - " + reportid + reportbody);
        // might need to have it just work on visual tab
      }
      $("#content-tmce").on("click", function (e) {
        // runs ajax request of word count etc when going from text/html tab to visual tab
        ajaxResults(reportid);
      });
      // runs typingResults() - ajax request of word count etc when user is done typing
      typingResults(reportid);
      // close overlay
      overlayView("close");
    });

    /**
     * go back to the reports list
     */
    $("#contop-goback").on("click", function (e) {
      // hide "add report?" module and show reports lists
      showModule("#contop-reports-list");
    });
    /**
     * ajax request of word count etc when user is done typing
     * @param {string} reportid single report id
     */
    function typingResults(reportid) {
      if ($("#wp-content-wrap").hasClass("tmce-active")) {
        let timeout = null;
        tinyMCE.get("content").on("keyup", function (e) {
          clearTimeout(timeout);
          timeout = setTimeout(function () {
            //console.log("Element changed:", e.target.nodeName);
            ajaxResults(reportid);
          }, 500);
        });
      } else {
      }
    }
    /**
     * get single report body text from json object if needed (incomplete)
     * @param {json} data ajax response json object
     */
    function singleReport(data) {
      const dataParse = JSON.parse(data.body);
      console.log(dataParse);
    }
    /**
     * ajax request that gets json data from rest api endpoint
     * @param {string} dataId ID that gets inserted in contentoptimizer-ajax.php
     * dataId gets added to the content optimizer api url to get the proper report
     * if dataId == reportsfeed then get the content optimizer api url of all reports
     */
    function ajaxResults(dataId) {
      $.ajax({
        type: "POST",
        dataType: "json",
        url: "/wp-json/v1/content-optimizer",
        data: { dataId },
        // show loading gif
        beforeSend: function () {
          $(".contop-load").show();
        },
        // hide loading gif
        complete: function (data) {
          $(".contop-load").hide();
        },
      })
        .done(function (response) {
          // if dataId == reportsfeed then get the content optimizer api url of all reports
          // otherwise dataId gets added to the content optimizer api url to get the proper single report
          if (dataId == "reportsfeed") {
            // list of functions that need reports feed, is there a way to store this response variable once?
            reportList(response);
          } else {
            singleReport(response);
          }
        })
        .fail(function (xhr, status, error) {
          var errorMessage = xhr.status + ": " + xhr.statusText;
          console.log("Error - " + errorMessage);
        });
    }
  }); // document ready // ajax inside or outside doc ready?
})(jQuery);
