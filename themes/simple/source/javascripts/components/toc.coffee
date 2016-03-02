# 获取标题编号
getHeadingNo = ( $h, tagName ) ->
  return $(tagName, $(".Article-content")).index($h) + 1

# 添加目录条目
addTocItem = ( $h ) ->
  id = $h.attr("id")
  tagName = $h.get(0).tagName.toLowerCase()

  if not id
    idx = getHeadingNo($h, tagName)
    id = "#{if tagName is "h2" then "h" else "subH"}eading-#{idx}"

    $h.attr "id", id

  return "<li><a href=\"##{id}\">#{$h.text()}</a></li>"

# 生成目录列表
generateToc = ->
  $toc = $("<ul class=\"nav\" />")
  $item = null

  $("h2, h3", $(".Article-content")).each ->
    $h = $(@)

    if @tagName.toLowerCase() is "h2"
      $item = $(addTocItem $h)

      $item.append("<ul class=\"nav\" />") if $("ul", $item).size() is 0
      $item.appendTo $toc
    else
      $("ul", $item).append addTocItem($h)

  return $toc

# 初始化目录
initToc = ( $toc ) ->
  cls = ".Widget--toc"

  $container = $(cls)
  $cnt = $(".Article-content")

  $container
    # 添加目录列表
    .find(".Widget-body").append($toc).closest cls
    # 初始化定位
    .on
      "affixed-top.bs.affix": ->
        $(@).css "position", "static"
      "affixed.bs.affix": ->
        $(@).css "position", "fixed"
    .affix
      offset:
        top: $container.offset().top
        bottom: ->
          return $(document).height() - ($cnt.offset().top + $cnt.outerHeight(true))

  $("body").scrollspy target: cls

$(document).ready ->
  $container = $(".Widget--toc")

  if $container.size() is 1
    $toc = generateToc()

    if $("li", $toc).size() > 0
      initToc $toc
    else
      $container.remove()
