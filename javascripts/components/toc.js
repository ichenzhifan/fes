(function() {
  var addTocItem, generateToc, getHeadingNo, initToc;

  getHeadingNo = function($h, tagName) {
    return $(tagName, $(".Article-content")).index($h) + 1;
  };

  addTocItem = function($h) {
    var id, idx, tagName;
    id = $h.attr("id");
    tagName = $h.get(0).tagName.toLowerCase();
    if (!id) {
      idx = getHeadingNo($h, tagName);
      id = (tagName === "h2" ? "h" : "subH") + "eading-" + idx;
      $h.attr("id", id);
    }
    return "<li><a href=\"#" + id + "\">" + ($h.text()) + "</a></li>";
  };

  generateToc = function() {
    var $item, $toc;
    $toc = $("<ul class=\"nav\" />");
    $item = null;
    $("h2, h3", $(".Article-content")).each(function() {
      var $h;
      $h = $(this);
      if (this.tagName.toLowerCase() === "h2") {
        $item = $(addTocItem($h));
        if ($("ul", $item).size() === 0) {
          $item.append("<ul class=\"nav\" />");
        }
        return $item.appendTo($toc);
      } else {
        return $("ul", $item).append(addTocItem($h));
      }
    });
    return $toc;
  };

  initToc = function($toc) {
    var $cnt, $container, cls;
    cls = ".Widget--toc";
    $container = $(cls);
    $cnt = $(".Article-content");
    $container.find(".Widget-body").append($toc).closest(cls).on({
      "affixed-top.bs.affix": function() {
        return $(this).css("position", "static");
      },
      "affixed.bs.affix": function() {
        return $(this).css("position", "fixed");
      }
    }).affix({
      offset: {
        top: $container.offset().top,
        bottom: function() {
          return $(document).height() - ($cnt.offset().top + $cnt.outerHeight(true));
        }
      }
    });
    return $("body").scrollspy({
      target: cls
    });
  };

  $(document).ready(function() {
    var $container, $toc;
    $container = $(".Widget--toc");
    if ($container.size() === 1) {
      $toc = generateToc();
      if ($("li", $toc).size() > 0) {
        return initToc($toc);
      } else {
        return $container.remove();
      }
    }
  });

}).call(this);
