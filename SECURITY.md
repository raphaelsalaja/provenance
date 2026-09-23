# Security Policy

## Supported versions

The latest released 0.x version receives security fixes. Earlier proposal
versions may receive documentation corrections but are not guaranteed fixes.

## Reporting a vulnerability

Do not open a public issue for an undisclosed vulnerability. Use GitHub's private
vulnerability reporting for this repository when available. If it is not
available, contact the maintainer through
[their GitHub profile](https://github.com/raphaelsalaja).

Include the affected version, impact, reproduction steps, and any suggested
mitigation. Reports should avoid real credentials or private provenance data.

The project will acknowledge a report, investigate it, and coordinate disclosure
after a fix or mitigation is available.

## Security boundaries

The reference CLI reads local YAML or JSON and writes local generated files. It
does not fetch source URLs, upload records, execute project code, or evaluate
extensions. Consumers should still treat provenance files from untrusted
repositories as untrusted input.
