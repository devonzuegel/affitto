# -*- encoding: utf-8 -*-
# stub: middleman-deploy 0.1.4 ruby lib

Gem::Specification.new do |s|
  s.name = "middleman-deploy"
  s.version = "0.1.4"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib"]
  s.authors = ["Tom Vaughan"]
  s.date = "2013-11-23"
  s.description = "Deploy a middleman built site over rsync, ftp, sftp, or git (e.g. gh-pages on github)."
  s.email = ["thomas.david.vaughan@gmail.com"]
  s.homepage = "http://github.com/tvaughan/middleman-deploy"
  s.licenses = ["MIT"]
  s.rubygems_version = "2.4.8"
  s.summary = "Deploy a middleman built site over rsync, ftp, sftp, or git (e.g. gh-pages on github)."

  s.installed_by_version = "2.4.8" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<middleman-core>, [">= 3.0.0"])
      s.add_runtime_dependency(%q<ptools>, [">= 0"])
      s.add_runtime_dependency(%q<net-sftp>, [">= 0"])
    else
      s.add_dependency(%q<middleman-core>, [">= 3.0.0"])
      s.add_dependency(%q<ptools>, [">= 0"])
      s.add_dependency(%q<net-sftp>, [">= 0"])
    end
  else
    s.add_dependency(%q<middleman-core>, [">= 3.0.0"])
    s.add_dependency(%q<ptools>, [">= 0"])
    s.add_dependency(%q<net-sftp>, [">= 0"])
  end
end
