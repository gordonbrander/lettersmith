local exports = {}

local paths = require("lettersmith").paths

local transducers = require("lettersmith.transducers")
local comp = transducers.comp

local concat = require("lettersmith.lazy").concat

local mix_meta = require("lettersmith.meta")
local render_markdown = require("lettersmith.markdown")
local lettersmith_mustache = require("lettersmith.mustache")
local choose_mustache = lettersmith_mustache.choose_mustache
local render_mustache = lettersmith_mustache.render_mustache
local choose_mustache = require("lettersmith.mustache").choose_mustache
local remove_drafts = require("lettersmith.drafts")
local paging = require("lettersmith.paging")
local render_permalinks = require("lettersmith.permalinks").render_permalinks
local format_date = require("lettersmith.format_date")

local function markdown_post(meta, permalink_format, date_format)
  return comp(
    render_markdown,
    render_permalinks(permalink_format),
    format_date(date_format),
    mix_meta(meta),
    remove_drafts
  )
end
exports.markdown_post = markdown_post

-- Create a blog in seconds.
-- Returns an iterator of transformed posts and pages, ready to pass to
-- lettersmith.build.
local function blog(meta, options)
  options = extend({
    blog_path = "_posts",
    pages_path = "_site",
    template_path = "_layouts",
    paging_template_path = "_layouts/list.html",
    permlink_format = ":yyyy/:mm/:slug/index.html",
    date_format = "%b %e, %Y",
    paging_path = "page/:n/index.html",
    per_page = 10
  }, options)

  local blog_paths = paths(blog_path)

  local blog_posts = pipe(
    blog_paths,
    docs,
    markdown_post(meta, options.permalink_format, options.date_format),
    choose_mustache(options.template_path),
  )

  local blog_paging = pipe(
    blog_paths,
    docs,
    markdown_post(meta, options.permalink_format, options.date_format),
    paging(options.paging_format, options.per_page),
    render_mustache(options.paging_template_path)
  )

  local pages = pipe(
    pages_path,
    paths,
    docs,
    markdown_post(meta, ":slug/index.html", options.date_format),
    choose_mustache(options.template_path)
  )

  return concat(blog_posts, blog_paging, pages)
end
exports.blog = blog

return exports