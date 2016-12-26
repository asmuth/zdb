FnordMetric.views["fnordmetric.metric.serie"] = function(elem, params) {
  'use strict';

  var api_path = "/fetch_series";
  var path = params.path;
  var url_params;
  var viewport_elem;
  var view_cfg;

  this.initialize = function() {
    url_params = getParams(params.path);
    var page = templateUtil.getTemplate("fnordmetric-metric-serie-tpl");

    DomUtil.handleLinks(page, params.app.navigateTo);
    DomUtil.replaceContent(elem, page);
    viewport_elem = elem.querySelector(".view_content");

    render();
    fetchData();
  }

  var updatePath = function() {
    console.log("update path");
    //FIXME 
    return;
    params.app.navigateTo(
        params.route.args[0] + "?" + URLUtil.buildQueryString(view_cfg.getParamList()));
  }

  var getParams = function(path) {
    var p = {};

    p.metric = params.route.args[1];
    p.series_id = params.route.args[2];

    var view_param = URLUtil.getParamValue(path, "view");
    if (view_param) {
      p.view = view_param;
    } else {
      p.view = "table";
    }

    var offset_param = URLUtil.getParamValue(path, "offset");
    if (offset_param) {
      p.offset = offset_param;
    }

    return p;
  }

  var fetchData = function() {
    var url = params.app.api_base_path + api_path + "?metric_id=" + url_params.metric; //FIXME 
    HTTPUtil.httpGet(url, {}, function(r) {
      if (r.status != 200) {
        params.app.renderError(
            "an error occured while loading the metric list:",
            r.response);
        return;
      }

      var serie;
      var series = JSON.parse(r.response).series;
      for (var i = 0; i < series.length; i++) {
        if (series[i].series_id == url_params.series_id) {
          serie = series[i];
          break;
        }
      }

      if (!serie) {
        //TODO handle empty result list
      } else {
        renderSerieLabels(serie.labels);
        renderView(serie.values);
      }
    });
  }

  var render = function() {
    renderHeader();
    // renderView(); --> initView
    renderTimerangeControl();
    renderEmbedControl();
  };

  var renderHeader = function(metric) {
    var metric_title = elem.querySelector(
        ".fnordmetric-metric-serie .page_header .metric_name");
    metric_title.innerHTML = url_params.metric;
    metric_title.setAttribute(
        "href",
        "/metrics/" + encodeURIComponent(url_params.metric));

    ///* handle view controls */
    //elem.querySelector(".fnordmetric-metric-serie .view_control").setAttribute(
    //    "data-view", view_cfg.getValue("view"));

    ///* switch to table view */
    //var table_view_ctrl = elem.querySelector(
    //    ".fnordmetric-metric-serie .view_control .table_view");
    //table_view_ctrl.addEventListener("click", function(e) {
    //  view_cfg.updateValue("view", "table");
    //  updatePath();
    //}, false);

    ///* switch to timeseries view */
    //var timeseries_view_ctrl = elem.querySelector(
    //    ".fnordmetric-metric-serie .view_control .timeseries_view");
    //timeseries_view_ctrl.addEventListener("click", function(e) {
    //  view_cfg.updateValue("view", "timeseries");
    //  updatePath();
    //}, false);
  };

  var renderSerieLabels = function(labels) {
    console.log(labels);
    var title = [];

    for (var label in labels) {
      title.push(label + ": " + labels[label]);
    }

    elem.querySelector(".fnordmetric-metric-serie .page_header .serie_name").
        innerHTML = DomUtil.escapeHTML(title.join(", "));
  }

  var renderTimerangeControl = function() {
    var dropdown = elem.querySelector(
        ".fnordmetric-metric-serie .control f-dropdown.timerange");

    //var compare_to_value = view_cfg.getValue("compare_to");
    //if (compare_to_value != null) {
    //  dropdown.setValue(compare_to_value);
    //}

    //dropdown.addEventListener("select", function(e) {
    //  view_cfg.updateValue("compare_to", e.detail.value);
    //  updatePath();
    //}, false);
  }

  var renderView = function(results) {
    //TODO enable / disable current view icon in header
    var view;
    var view_opts = {
      data: results
    };

    switch (url_params.view){
      case "table":
        view = FnordMetric.views["fnordmetric.metric.serie.table"];
        break;

      case "timeseries":
        view = FnordMetric.views["fnordmetric.metric.serie.chart"];
        break;

      default:
        view = FnordMetric.views["fnordmetric.404"];
        break;
    }

    //render view
    viewport_elem.innerHTML = "";

    var current_view = {};
    view.call(current_view, viewport_elem, view_opts);
    if (current_view.initialize) {
      current_view.initialize.call(current_view);
    }
  }

  //var renderFilterList = function() {
  //  var filter_strs = view_cfg.getValue("filter") ? view_cfg.getValue("filter") : [];
  //  var filter_ctrl = new FnordMetric.MetricTableFilter(
  //      elem.querySelector(".fnordmetric-metric-table z-modal.filter"));

  //  /* add a new filter */
  //  var add_link = elem.querySelector(
  //      ".fnordmetric-metric-table .sidebar a.add_filter");
  //  add_link.addEventListener("click", function(e) {
  //    filter_ctrl.render();
  //  }, false);
  //  filter_ctrl.onSubmit(function(filter_str) {
  //    console.log(filter_str);
  //    filter_strs.push(filter_str);
  //    view_cfg.updateValue("filter", filter_strs);
  //    updatePath();
  //  });

  //  /* render exisiting filter list */
  //  var flist_elem = elem.querySelector(
  //      ".fnordmetric-metric-table .sidebar .filter_list");
  //  var felem_tpl = templateUtil.getTemplate(
  //      "fnordmetric-metric-table-filter-list-elem-tpl");

  //  filter_strs.forEach(function(f) {
  //    var felem = felem_tpl.cloneNode(true);
  //    felem.querySelector(".filter_value").innerHTML = f;

  //    felem.querySelector(".edit").addEventListener("click", function(e) {
  //      filter_ctrl.render(f);
  //    });

  //    flist_elem.appendChild(felem);
  //  });

  //  /* change an existing filter */
  //  filter_ctrl.onChange(function(new_filter_str, old_filter_str) {
  //    var idx = filter_strs.indexOf(old_filter_str);
  //    if (idx > -1) {
  //      filter_strs[idx] = new_filter_str;
  //    }

  //    view_cfg.updateValue("filter", filter_strs);
  //    updatePath();
  //  });

  //  /* remove an exisiting filter */
  //  filter_ctrl.onDelete(function(old_filter_str) {
  //    var idx = filter_strs.indexOf(old_filter_str);
  //    if (idx > -1) {
  //      filter_strs.splice(idx, 1);
  //    }
  //    view_cfg.updateValue("filter", filter_strs);
  //    updatePath();
  //  });
  //}

  var renderEmbedControl = function() {
    elem.querySelector(".fnordmetric-metric-serie .control.embed")
        .addEventListener("click", function() {
          fEmbedPopup(elem, "").render();
        }, false);
  }
}
