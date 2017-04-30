/**
 * This file is part of the "FnordMetric" project
 *   Copyright (c) 2016 Paul Asmuth, Laura Schlimmer, FnordCorp B.V.
 *
 * FnordMetric is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License v3.0. You should have received a
 * copy of the GNU General Public License along with this program. If not, see
 * <http://www.gnu.org/licenses/>.
 */
#pragma once
#include <fnordmetric/util/return_code.h>

namespace fnordmetric {

class Command {
public:

  virtual ~Command() = default;

  virtual ReturnCode execute(const std::vector<std::string>& argv) = 0;

  virtual const String& getName() const = 0;
  virtual const String& getDescription() const = 0;

  virtual void printHelp() const = 0;

};

} // namespace fnordmetric



