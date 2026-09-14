import base64
import io
import os
from pathlib import Path
import re
import zipfile


def redact_archive(content: bytes, token: bytes) -> bytes:
    output = io.BytesIO()
    with zipfile.ZipFile(io.BytesIO(content)) as source:
        with zipfile.ZipFile(output, "w") as destination:
            for entry in source.infolist():
                destination.writestr(entry, source.read(entry).replace(token, b"[REDACTED]"))
    return output.getvalue()


def redact_content(content: bytes, token: bytes, suffix: str) -> bytes:
    if suffix == ".zip":
        return redact_archive(content, token)
    if suffix == ".html":
        content = re.sub(
            rb"(data:application/zip;base64,)([A-Za-z0-9+/=]+)",
            lambda match: match[1]
            + base64.b64encode(redact_archive(base64.b64decode(match[2]), token)),
            content,
        )
    return content.replace(token, b"[REDACTED]")


def main() -> None:
    token = os.environ.get("PLAYWRIGHT_VERCEL_TRUSTED_OIDC_TOKEN", "").encode()
    if not token:
        return
    paths = [
        path
        for directory in [Path("playwright-report"), Path("test-results")]
        for path in directory.rglob("*")
        if path.is_file()
    ]
    output_path = os.environ.get("PLAYWRIGHT_OUTPUT_FILE")
    if output_path and Path(output_path).is_file():
        paths.append(Path(output_path))
    for path in paths:
        content = path.read_bytes()
        redacted = redact_content(content, token, path.suffix)
        if redacted != content:
            path.write_bytes(redacted)


if __name__ == "__main__":
    main()
