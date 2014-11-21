/**
 * This file is part of the "FnordMetric" project
 *   Copyright (c) 2014 Paul Asmuth, Google Inc.
 *
 * FnordMetric is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License v3.0. You should have received a
 * copy of the GNU General Public License along with this program. If not, see
 * <http://www.gnu.org/licenses/>.
 */
#ifndef _FNORD_WEBUI_BUNDLE_H
#define _FNORD_WEBUI_BUNDLE_H
#include <string>

namespace fnord {
namespace webui {

class Bundle {
public:
  Bundle(const std::string& title = "Fnord WebUI");

  void build(const std::string& base_path = "/");

  const std::string& applicationHTML();
  const std::string& applicationCSS();
  const std::string& applicationJS();

protected:
  std::string title_;
  std::string app_html_;
  std::string app_css_;
  std::string app_js_;
};

} // namespace webui
} // namespace fnord

#endif
